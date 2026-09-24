import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { RazorpayService, RazorpayOrderResult } from './razorpay.service';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CreatePayoutAccountDto } from './dto/create-payout-account.dto';
import { ENTRY_FEE_RUPEES, PAYMENT_EVENTS, VERIFICATION_FEE_RUPEES } from './payments.constants';
import {
  EntryFeePaidEvent,
  TransactionPaidEvent,
  VerificationFeePaidEvent,
} from './events/payment.events';

/** Order result plus what actually happened to it — DEMO_MODE may have already confirmed it before this even returns. */
export interface OrderWithStatus extends RazorpayOrderResult {
  status: 'created' | 'paid';
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpay: RazorpayService,
    private readonly events: EventEmitter2,
    private readonly config: ConfigService,
  ) {}

  isDemoMode(): boolean {
    return this.config.get<boolean>('demoMode', false);
  }

  /**
   * Bank details are sent straight to Razorpay and never stored on our
   * side — only their returned linked-account id is kept, same principle
   * as KYC (store the provider's reference, never the underlying sensitive
   * document/data). See RazorpayService.createLinkedAccount's header
   * comment: the exact field set is a reasonable default, not independently
   * confirmed against Razorpay's current Linked Account API reference.
   */
  async createPayoutAccount(userId: string, dto: CreatePayoutAccountDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.razorpayLinkedAccountId) {
      throw new BadRequestException('A payout account is already on file for this user');
    }

    const linkedAccountId = await this.razorpay.createLinkedAccount({
      sellerUserId: userId,
      name: dto.beneficiaryName,
      email: dto.email,
      phone: dto.phone,
      bankAccountNumber: dto.bankAccountNumber,
      bankIfsc: dto.bankIfsc,
      beneficiaryName: dto.beneficiaryName,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { razorpayLinkedAccountId: linkedAccountId },
    });
  }

  /**
   * Called by the listings module when a seller requests verification.
   * Does NOT create the VerificationRequest itself — that only happens once
   * payment is actually confirmed (see the event listener in
   * VerificationModule). This method just starts the payment — and, in
   * DEMO_MODE, immediately confirms it too (see class comment / README).
   */
  async createVerificationFeeOrder(listingId: string, sellerId: string): Promise<OrderWithStatus> {
    const order = await this.razorpay.createOrder(
      VERIFICATION_FEE_RUPEES,
      `verify_${listingId}`.slice(0, 40),
    );

    await this.prisma.verificationFeePayment.create({
      data: {
        listingId,
        sellerId,
        amount: VERIFICATION_FEE_RUPEES,
        razorpayOrderId: order.orderId,
        status: 'CREATED',
      },
    });

    if (this.isDemoMode()) {
      await this.markPaidByOrderId(order.orderId, `demo_${randomUUID()}`);
      return { ...order, status: 'paid' };
    }
    return { ...order, status: 'created' };
  }

  /** Called by the bidding module before a user's first bid on a given auction. */
  async createEntryFeeOrder(auctionId: string, userId: string): Promise<OrderWithStatus> {
    const existing = await this.prisma.auctionEntryPayment.findUnique({
      where: { auctionId_userId: { auctionId, userId } },
    });

    if (existing?.status === 'PAID') {
      throw new BadRequestException('Entry fee has already been paid for this auction');
    }

    const order = await this.razorpay.createOrder(
      ENTRY_FEE_RUPEES,
      `entry_${auctionId}_${userId}`.slice(0, 40),
    );

    if (existing) {
      // Reusing the row after an earlier abandoned/failed attempt — same
      // (auction, user) pair, fresh Razorpay order.
      await this.prisma.auctionEntryPayment.update({
        where: { id: existing.id },
        data: { razorpayOrderId: order.orderId, status: 'CREATED', razorpayPaymentId: null },
      });
    } else {
      await this.prisma.auctionEntryPayment.create({
        data: {
          auctionId,
          userId,
          amount: ENTRY_FEE_RUPEES,
          razorpayOrderId: order.orderId,
          status: 'CREATED',
        },
      });
    }

    if (this.isDemoMode()) {
      await this.markPaidByOrderId(order.orderId, `demo_${randomUUID()}`);
      return { ...order, status: 'paid' };
    }
    return { ...order, status: 'created' };
  }

  /**
   * Called by EscrowModule when a buyer wants to pay for a won auction.
   * Unlike verification/entry fees, there's no separate tracking table here
   * — Transaction (owned by EscrowModule) already has its own
   * razorpayOrderId/razorpayPaymentId columns, so this just creates the
   * order and hands back the id for EscrowService to store. DEMO_MODE
   * auto-confirm happens in EscrowService instead, once it has actually
   * persisted the orderId onto the Transaction row (markPaidByOrderId looks
   * the transaction up BY that orderId, so it has to exist first).
   */
  async createTransactionPaymentOrder(
    transactionId: string,
    amountRupees: number,
  ): Promise<RazorpayOrderResult> {
    return this.razorpay.createOrder(amountRupees, `txn_${transactionId}`.slice(0, 40));
  }

  /**
   * Client-side instant-confirm path — called right after Razorpay Checkout
   * completes in the browser. Fast UX feedback; the webhook (below) is the
   * authoritative path per Razorpay's own guidance, and this is safe to call
   * twice (idempotent) in case both arrive.
   */
  async confirmCheckoutPayment(dto: ConfirmPaymentDto): Promise<void> {
    const valid = this.razorpay.verifyCheckoutSignature(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );
    if (!valid) throw new UnauthorizedException('Invalid payment signature');

    await this.markPaidByOrderId(dto.razorpayOrderId, dto.razorpayPaymentId);
  }

  /** Authoritative path. rawBody must be the exact bytes Razorpay signed — see main.ts. */
  async handleWebhook(rawBody: string, signature: string): Promise<void> {
    const valid = this.razorpay.verifyWebhookSignature(rawBody, signature);
    if (!valid) throw new UnauthorizedException('Invalid webhook signature');

    const payload = JSON.parse(rawBody);
    if (payload.event !== 'payment.captured') return; // not a payment success — nothing to do

    const paymentEntity = payload.payload?.payment?.entity;
    if (!paymentEntity?.order_id || !paymentEntity?.id) {
      this.logger.warn('Razorpay webhook payload missing expected payment entity fields');
      return;
    }

    await this.markPaidByOrderId(paymentEntity.order_id, paymentEntity.id);
  }

  /**
   * Idempotent by design: the checkout-confirm call, the webhook, and (in
   * DEMO_MODE) the immediate synchronous auto-confirm can all race each
   * other in principle — whichever gets here first flips the row to PAID
   * and fires the event; anything after that sees status already PAID and
   * no-ops. Public because EscrowService's transaction-payment path (see
   * its own DEMO_MODE handling) needs to trigger the exact same confirmed
   * path once it has persisted its own razorpayOrderId, rather than a
   * separate parallel implementation.
   */
  async markPaidByOrderId(orderId: string, paymentId: string): Promise<void> {
    const verificationPayment = await this.prisma.verificationFeePayment.findUnique({
      where: { razorpayOrderId: orderId },
    });
    if (verificationPayment) {
      if (verificationPayment.status === 'PAID') return;
      await this.prisma.verificationFeePayment.update({
        where: { id: verificationPayment.id },
        data: { status: 'PAID', razorpayPaymentId: paymentId, paidAt: new Date() },
      });
      await this.events.emitAsync(
        PAYMENT_EVENTS.VERIFICATION_FEE_PAID,
        new VerificationFeePaidEvent(
          verificationPayment.listingId,
          verificationPayment.sellerId,
          verificationPayment.id,
        ),
      );
      return;
    }

    const entryPayment = await this.prisma.auctionEntryPayment.findUnique({
      where: { razorpayOrderId: orderId },
    });
    if (entryPayment) {
      if (entryPayment.status === 'PAID') return;
      await this.prisma.auctionEntryPayment.update({
        where: { id: entryPayment.id },
        data: { status: 'PAID', razorpayPaymentId: paymentId, paidAt: new Date() },
      });
      await this.events.emitAsync(
        PAYMENT_EVENTS.ENTRY_FEE_PAID,
        new EntryFeePaidEvent(entryPayment.auctionId, entryPayment.userId),
      );
      return;
    }

    // Transaction (the winning-bid payment) is owned by EscrowModule, not
    // here — this only checks idempotency and emits. All the actual writes
    // (status, paidAt, fee/commission calculation, the held Route transfer)
    // happen in EscrowService's listener, since that's where the rest of
    // the transaction state machine already lives.
    const transaction = await this.prisma.transaction.findUnique({
      where: { razorpayOrderId: orderId },
    });
    if (transaction) {
      if (transaction.status !== 'AWAITING_PAYMENT') return;
      await this.events.emitAsync(
        PAYMENT_EVENTS.TRANSACTION_PAID,
        new TransactionPaidEvent(transaction.id, paymentId),
      );
      return;
    }

    this.logger.warn(`Payment confirmed for an order we have no record of: ${orderId}`);
  }
}
