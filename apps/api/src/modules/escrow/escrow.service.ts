import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { randomUUID } from 'crypto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { RazorpayService } from '../payments/razorpay.service';
import { PaymentsService } from '../payments/payments.service';
import { AUCTION_EVENTS, AuctionEndedEvent } from '../auctions/events/auction.events';
import {
  AUTO_RELEASE_DAYS,
  PAYMENT_EVENTS,
  PAYMENT_WINDOW_HOURS,
} from '../payments/payments.constants';
import { TransactionPaidEvent } from '../payments/events/payment.events';
import { ESCROW_LIFECYCLE_QUEUE } from './escrow.constants';
import { computePayout, round2 } from './escrow-math';
import { ESCROW_EVENTS, TransactionCreatedEvent } from './events/escrow.events';
import type { EscrowEventType } from '@prisma/client';

@Injectable()
export class EscrowService {
  private readonly logger = new Logger(EscrowService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpay: RazorpayService,
    private readonly payments: PaymentsService,
    @InjectQueue(ESCROW_LIFECYCLE_QUEUE) private readonly queue: Queue,
    private readonly events: EventEmitter2,
  ) {}

  // ---------------------------------------------------------------------
  // Ledger — the ONLY method in the codebase that should write to
  // EscrowLedgerEntry. Nothing here ever updates or deletes a row; every
  // state change is a new append, per tech stack §5's "immutable ledger."
  // ---------------------------------------------------------------------
  private async appendLedger(
    transactionId: string,
    eventType: EscrowEventType,
    amount?: number,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.prisma.escrowLedgerEntry.create({
      data: {
        transactionId,
        eventType,
        amount,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });
  }

  // ---------------------------------------------------------------------
  // Transaction creation — triggered by an auction ending with a winner.
  // ---------------------------------------------------------------------
  @OnEvent(AUCTION_EVENTS.ENDED)
  async handleAuctionEnded(event: AuctionEndedEvent): Promise<void> {
    if (!event.winningBidderId || event.winningBid === null) return; // no bids — AuctionsService already set CANCELLED

    const auction = await this.prisma.auction.findUnique({ where: { id: event.auctionId } });
    if (!auction) return;

    await this.createTransactionForBidder(
      event.auctionId,
      event.winningBidderId,
      event.winningBid,
      auction.sellerId,
    );
  }

  private async createTransactionForBidder(
    auctionId: string,
    buyerId: string,
    amount: number,
    sellerId: string,
  ): Promise<void> {
    const paymentDeadline = new Date(Date.now() + PAYMENT_WINDOW_HOURS * 60 * 60 * 1000);

    const transaction = await this.prisma.transaction.create({
      data: { auctionId, buyerId, sellerId, amount, status: 'AWAITING_PAYMENT', paymentDeadline },
    });

    await this.prisma.auction.update({
      where: { id: auctionId },
      data: { currentTransactionId: transaction.id },
    });

    await this.queue.add(
      'payment-deadline',
      { transactionId: transaction.id },
      {
        delay: PAYMENT_WINDOW_HOURS * 60 * 60 * 1000,
        jobId: `payment-deadline:${transaction.id}`,
        removeOnComplete: true,
      },
    );

    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      select: { title: true },
    });
    this.events.emit(
      ESCROW_EVENTS.TRANSACTION_CREATED,
      new TransactionCreatedEvent(
        transaction.id,
        buyerId,
        auction?.title ?? 'the item',
        amount,
        paymentDeadline,
      ),
    );
  }

  // ---------------------------------------------------------------------
  // Buyer pays
  // ---------------------------------------------------------------------
  async getPaymentOrder(transactionId: string, buyerId: string) {
    const transaction = await this.getTransactionOr404(transactionId);
    if (transaction.buyerId !== buyerId) {
      throw new ForbiddenException('This is not your transaction to pay');
    }
    if (transaction.status !== 'AWAITING_PAYMENT') {
      throw new BadRequestException(
        `Cannot pay a transaction that is ${transaction.status.toLowerCase()}`,
      );
    }
    if (transaction.paymentDeadline.getTime() <= Date.now()) {
      throw new BadRequestException('The payment window for this transaction has passed');
    }

    const order = await this.payments.createTransactionPaymentOrder(
      transactionId,
      Number(transaction.amount),
    );
    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { razorpayOrderId: order.orderId },
    });

    // DEMO_MODE: markPaidByOrderId needs razorpayOrderId already persisted
    // (it looks the transaction up BY that field), which is why this
    // happens here rather than inside PaymentsService.createTransactionPaymentOrder
    // itself — see that method's comment.
    if (this.payments.isDemoMode()) {
      await this.payments.markPaidByOrderId(order.orderId, `demo_${randomUUID()}`);
    }

    const current = await this.getTransactionOr404(transactionId);
    return { ...order, status: current.status === 'PAID' ? 'paid' : 'created' };
  }

  /**
   * Atomic claim on the status transition, per the same reasoning as
   * verifier request claiming (Phase 2): the checkout-confirm call and the
   * webhook race each other in the real world, and PaymentsService emits
   * this event from *both* paths. Whichever gets here first wins the
   * updateMany (count 1); the other sees count 0 and skips every side
   * effect below — no double ledger entries, no double transfer creation.
   */
  @OnEvent(PAYMENT_EVENTS.TRANSACTION_PAID)
  async handleTransactionPaid(event: TransactionPaidEvent): Promise<void> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: event.transactionId },
    });
    if (!transaction) {
      this.logger.warn(`TRANSACTION_PAID for unknown transaction ${event.transactionId}`);
      return;
    }

    // Real fee/tax from Razorpay, not an assumed percentage — see README
    // and RazorpayService.fetchPaymentFees for why.
    const fees = await this.razorpay.fetchPaymentFees(event.razorpayPaymentId);
    const { commissionAmount, payoutAmount } = computePayout(
      Number(transaction.amount),
      fees.fee,
      fees.tax,
    );

    const claimed = await this.prisma.transaction.updateMany({
      where: { id: event.transactionId, status: 'AWAITING_PAYMENT' },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        razorpayPaymentId: event.razorpayPaymentId,
        gatewayFeeAmount: fees.fee,
        gatewayTaxAmount: fees.tax,
        commissionAmount,
        payoutAmount,
      },
    });
    if (claimed.count === 0) {
      this.logger.debug(
        `Transaction ${event.transactionId} already processed as PAID — skipping duplicate`,
      );
      return;
    }

    await this.prisma.auction.update({
      where: { id: transaction.auctionId },
      data: { status: 'SOLD' },
    });
    await this.appendLedger(transaction.id, 'HELD', payoutAmount, {
      razorpayPaymentId: event.razorpayPaymentId,
      commissionAmount,
      gatewayFeeAmount: fees.fee,
      gatewayTaxAmount: fees.tax,
    });

    await this.tryCreateHeldTransfer(
      transaction.id,
      transaction.sellerId,
      event.razorpayPaymentId,
      payoutAmount,
    );
  }

  /**
   * Not every seller will have completed Route onboarding by the time a
   * buyer pays — that's an operational gap, not a payment failure, so it's
   * logged and left for release time to surface loudly (as WITHHELD) rather
   * than blocking the payment confirmation itself.
   */
  private async tryCreateHeldTransfer(
    transactionId: string,
    sellerId: string,
    razorpayPaymentId: string,
    payoutAmount: number,
  ): Promise<void> {
    const seller = await this.prisma.user.findUnique({ where: { id: sellerId } });
    if (!seller?.razorpayLinkedAccountId) {
      this.logger.warn(
        `Seller ${sellerId} has no Razorpay linked account yet — transfer deferred to release time (transaction ${transactionId})`,
      );
      return;
    }

    try {
      const transferId = await this.razorpay.createHeldTransfer(
        razorpayPaymentId,
        seller.razorpayLinkedAccountId,
        payoutAmount,
      );
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { razorpayTransferId: transferId },
      });
    } catch (err) {
      this.logger.error(
        `Failed to create held transfer for transaction ${transactionId}`,
        err instanceof Error ? err.stack : undefined,
      );
      // Not rethrown: the payment itself is still valid and captured. This
      // gets another chance to resolve at release time.
    }
  }

  // ---------------------------------------------------------------------
  // Delivery confirmation — called by ShippingModule (Phase 5) once the
  // buyer uploads their receipt photos.
  // ---------------------------------------------------------------------
  async markDelivered(transactionId: string): Promise<void> {
    const claimed = await this.prisma.transaction.updateMany({
      where: { id: transactionId, status: 'PAID' },
      data: { status: 'DELIVERED', deliveredAt: new Date() },
    });
    if (claimed.count === 0) {
      throw new BadRequestException('Transaction must be PAID before delivery can be confirmed');
    }

    await this.appendLedger(transactionId, 'DELIVERED');

    await this.queue.add(
      'auto-release',
      { transactionId },
      {
        delay: AUTO_RELEASE_DAYS * 24 * 60 * 60 * 1000,
        jobId: `auto-release:${transactionId}`,
        removeOnComplete: true,
      },
    );
  }

  // ---------------------------------------------------------------------
  // Release — manual (admin) or automatic (the 3-day job below)
  // ---------------------------------------------------------------------
  async release(transactionId: string): Promise<void> {
    // Tech stack §5's state machine puts a `dispute_window` stage between
    // delivery and release — realized here as: an open dispute blocks
    // release outright, rather than as a separate formal status. Resolving
    // the dispute (DisputesService) is what re-triggers release, not a
    // retry loop here.
    const openDispute = await this.prisma.dispute.findFirst({
      where: { transactionId, status: { in: ['OPEN', 'UNDER_REVIEW'] } },
    });
    if (openDispute) {
      throw new BadRequestException(
        'This transaction has an open dispute — release is blocked until it resolves',
      );
    }

    const claimed = await this.prisma.transaction.updateMany({
      where: { id: transactionId, status: 'DELIVERED' },
      data: { status: 'RELEASED', payoutStatus: 'RELEASED', payoutReleasedAt: new Date() },
    });
    if (claimed.count === 0) {
      const existing = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
      throw new BadRequestException(
        `Cannot release a transaction that is ${existing?.status?.toLowerCase() ?? 'not found'} — delivery must be confirmed first`,
      );
    }

    const transaction = await this.getTransactionOr404(transactionId);

    if (!transaction.razorpayTransferId) {
      // Seller still hasn't onboarded a linked account by release time —
      // this needs a human, not a retry loop. Surface it as WITHHELD rather
      // than silently doing nothing.
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { payoutStatus: 'WITHHELD' },
      });
      await this.appendLedger(transactionId, 'WITHHELD', undefined, {
        reason: 'Seller has no Razorpay linked account — payout cannot be transferred',
      });
      this.logger.warn(
        `Transaction ${transactionId} marked WITHHELD at release time — seller ${transaction.sellerId} has no linked account`,
      );
      return;
    }

    await this.razorpay.releaseTransfer(transaction.razorpayTransferId);
    await this.appendLedger(
      transactionId,
      'RELEASED',
      transaction.payoutAmount ? Number(transaction.payoutAmount) : undefined,
      { razorpayTransferId: transaction.razorpayTransferId },
    );
  }

  // ---------------------------------------------------------------------
  // Called by DisputesModule — appendLedger stays the only thing that
  // actually writes to EscrowLedgerEntry; this is the one sanctioned way
  // for another module to record a ledger event without reaching into
  // Prisma directly and breaking that discipline.
  // ---------------------------------------------------------------------
  async recordDisputeOpened(transactionId: string, disputeId: string): Promise<void> {
    await this.appendLedger(transactionId, 'DISPUTED', undefined, { disputeId });
  }

  // ---------------------------------------------------------------------
  // Dispute-driven refunds — called by DisputesModule only. Default policy
  // (proceed-with-your-best-default, per the user's explicit instruction):
  // the SELLER's payout absorbs the full cost of any refund; the platform's
  // 7% commission is treated as already-earned and is never itself
  // refunded. This is the most common real-world marketplace pattern, but
  // it's also the option most favorable to the platform — flagged
  // prominently in the README as a business-policy decision that needs
  // real confirmation, not an engineering inevitability.
  // ---------------------------------------------------------------------

  /** Full refund: buyer gets everything back, seller gets nothing, any held transfer is reversed rather than released. */
  async refundFull(transactionId: string, disputeId: string): Promise<void> {
    const transaction = await this.getTransactionOr404(transactionId);
    if (!transaction.razorpayPaymentId) {
      throw new BadRequestException('Transaction has no captured payment to refund');
    }

    await this.razorpay.refundPayment(transaction.razorpayPaymentId, Number(transaction.amount));

    if (transaction.razorpayTransferId) {
      await this.razorpay.reverseTransfer(transaction.razorpayTransferId);
    }

    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'REFUNDED' },
    });

    await this.appendLedger(transactionId, 'REFUNDED', Number(transaction.amount), {
      disputeId,
      scope: 'full',
    });
  }

  /**
   * Partial refund: buyer gets `refundAmount` back, seller's payout is
   * reduced by exactly that much. Razorpay transfers can't be edited in
   * place — the original held transfer is reversed and a new one is
   * created for the reduced amount, then released immediately (the dispute
   * resolving IS what the seller was waiting on; no reason to make them
   * wait for another auto-release cycle).
   */
  async refundPartialAndRelease(
    transactionId: string,
    disputeId: string,
    refundAmount: number,
  ): Promise<void> {
    const transaction = await this.getTransactionOr404(transactionId);
    if (!transaction.razorpayPaymentId) {
      throw new BadRequestException('Transaction has no captured payment to refund');
    }
    if (refundAmount <= 0 || refundAmount >= Number(transaction.amount)) {
      throw new BadRequestException(
        'A partial refund must be greater than 0 and less than the full transaction amount',
      );
    }

    await this.razorpay.refundPayment(transaction.razorpayPaymentId, refundAmount);
    await this.appendLedger(transactionId, 'REFUNDED', refundAmount, {
      disputeId,
      scope: 'partial',
    });

    const originalPayout = transaction.payoutAmount ? Number(transaction.payoutAmount) : 0;
    const adjustedPayout = round2(originalPayout - refundAmount);

    if (transaction.razorpayTransferId) {
      await this.razorpay.reverseTransfer(transaction.razorpayTransferId);
    }

    const seller = await this.prisma.user.findUnique({ where: { id: transaction.sellerId } });
    let newTransferId: string | null = null;
    if (seller?.razorpayLinkedAccountId && adjustedPayout > 0) {
      newTransferId = await this.razorpay.createHeldTransfer(
        transaction.razorpayPaymentId,
        seller.razorpayLinkedAccountId,
        adjustedPayout,
      );
    }

    // Put the transaction back into a release-able shape with the adjusted
    // numbers, then reuse release() itself rather than duplicating its
    // payout-transfer/ledger/status-transition logic.
    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'DELIVERED',
        payoutAmount: adjustedPayout,
        razorpayTransferId: newTransferId,
      },
    });

    await this.release(transactionId);
  }

  // ---------------------------------------------------------------------
  // 48h non-payment cascade
  // ---------------------------------------------------------------------
  async handlePaymentDeadline(transactionId: string): Promise<void> {
    const claimed = await this.prisma.transaction.updateMany({
      where: { id: transactionId, status: 'AWAITING_PAYMENT' },
      data: { status: 'CANCELLED' },
    });
    if (claimed.count === 0) return; // already paid (or otherwise resolved) before the deadline job ran

    const transaction = await this.getTransactionOr404(transactionId);
    await this.appendLedger(transactionId, 'CANCELLED', undefined, {
      reason: 'payment_window_expired',
    });

    const nextBidderId = await this.findNextUntriedBidderId(transaction.auctionId);
    if (nextBidderId) {
      const nextBid = await this.prisma.bid.findFirst({
        where: { auctionId: transaction.auctionId, bidderId: nextBidderId },
        orderBy: { amount: 'desc' },
      });
      if (nextBid) {
        await this.createTransactionForBidder(
          transaction.auctionId,
          nextBidderId,
          Number(nextBid.amount),
          transaction.sellerId,
        );
        return;
      }
    }

    // Bidder list exhausted — nobody paid. Per the PRD's cancellation
    // clause, this is treated as equivalent to an outright cancellation:
    // refund every entry fee paid on this auction. (Confirmed with the
    // user as the default to proceed with — see README.)
    await this.prisma.auction.update({
      where: { id: transaction.auctionId },
      data: { status: 'CANCELLED' },
    });
    await this.refundAllEntryFees(transaction.auctionId);
  }

  private async findNextUntriedBidderId(auctionId: string): Promise<string | null> {
    const [bids, triedTransactions] = await Promise.all([
      this.prisma.bid.findMany({
        where: { auctionId },
        orderBy: { amount: 'desc' },
        select: { bidderId: true },
      }),
      this.prisma.transaction.findMany({ where: { auctionId }, select: { buyerId: true } }),
    ]);

    const alreadyTried = new Set<string>(
      triedTransactions.map((t: { buyerId: string }) => t.buyerId),
    );
    const uniqueBidderIds: string[] = Array.from(
      new Set<string>(bids.map((b: { bidderId: string }) => b.bidderId)),
    );
    const next = uniqueBidderIds.find((id) => !alreadyTried.has(id));
    return next ?? null;
  }

  private async refundAllEntryFees(auctionId: string): Promise<void> {
    const paidEntries = await this.prisma.auctionEntryPayment.findMany({
      where: { auctionId, status: 'PAID' },
    });

    for (const entry of paidEntries) {
      try {
        const refundId = await this.razorpay.refundPayment(
          entry.razorpayPaymentId as string,
          Number(entry.amount),
        );
        await this.prisma.auctionEntryPayment.update({
          where: { id: entry.id },
          data: { status: 'REFUNDED', razorpayRefundId: refundId, refundedAt: new Date() },
        });
      } catch (err) {
        // One failed refund shouldn't stop the others from going through.
        this.logger.error(
          `Failed to refund entry fee ${entry.id} for auction ${auctionId}`,
          err instanceof Error ? err.stack : undefined,
        );
      }
    }
  }

  // ---------------------------------------------------------------------
  // Reads
  // ---------------------------------------------------------------------
  async getTransactionOr404(transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async getForParticipant(transactionId: string, userId: string) {
    const transaction = await this.getTransactionOr404(transactionId);
    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      throw new ForbiddenException('You are not a party to this transaction');
    }
    return transaction;
  }

  /**
   * Not in the PRD's enumerated endpoint list — needed because the
   * frontend's Transactions page has nowhere else to get "everything I'm
   * involved in" from. Returns both sides (as buyer and as seller) in one
   * list with a `role` tag per row, since every Onbid account is both by
   * design (see README's Phase 2 assumptions) — a user's "orders" and
   * "purchases" are the same underlying table, just filtered by which side
   * they were on for that particular transaction.
   */
  async listMine(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      include: { auction: { select: { title: true, photos: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((t: Record<string, unknown>) => ({
      ...t,
      role: t.buyerId === userId ? 'buyer' : 'seller',
      status: (t.status as string).toLowerCase(),
      payoutStatus: (t.payoutStatus as string).toLowerCase(),
    }));
  }
}
