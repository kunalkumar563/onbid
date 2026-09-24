import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import Razorpay from 'razorpay';
import axios, { AxiosInstance } from 'axios';
import { RAZORPAY_CURRENCY } from './payments.constants';

export interface RazorpayOrderResult {
  orderId: string;
  amount: number; // paise
  currency: string;
  keyId: string; // public key — safe to hand to the client for Checkout
}

export interface PaymentFees {
  /** All in rupees (converted from Razorpay's paise) */
  capturedAmount: number;
  fee: number;
  tax: number;
}

export interface LinkedAccountInput {
  sellerUserId: string; // used as a reference id, not sent to Razorpay
  name: string;
  email: string;
  phone: string;
  bankAccountNumber: string;
  bankIfsc: string;
  beneficiaryName: string;
}

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private readonly client: Razorpay;
  private readonly http: AxiosInstance;
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly webhookSecret?: string;

  constructor(private readonly config: ConfigService) {
    this.keyId = this.config.get<string>('razorpay.keyId', '');
    this.keySecret = this.config.get<string>('razorpay.keySecret', '');
    this.webhookSecret = this.config.get<string>('razorpay.webhookSecret');

    if (!this.keyId || !this.keySecret) {
      this.logger.warn(
        'RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set — order creation will fail until configured',
      );
    }

    this.client = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });

    // Route's linked-account/transfer endpoints are called directly rather
    // than through the `razorpay` npm package: I confirmed the overall
    // hold/release mechanism and the core REST paths via Razorpay's own
    // Route docs, but I have not independently confirmed the SDK's exact
    // wrapper method names for these more specialized endpoints, and would
    // rather call the documented REST API directly than guess at an SDK
    // surface I'm not fully sure of.
    this.http = axios.create({
      baseURL: 'https://api.razorpay.com/v1',
      auth: { username: this.keyId, password: this.keySecret },
    });
  }

  /** amountRupees is whole rupees (₹49) — Razorpay's Orders API wants paise. */
  async createOrder(amountRupees: number, receipt: string): Promise<RazorpayOrderResult> {
    const amountPaise = Math.round(amountRupees * 100);
    const order = await this.client.orders.create({
      amount: amountPaise,
      currency: RAZORPAY_CURRENCY,
      receipt,
      payment_capture: true,
    });

    return {
      orderId: order.id,
      amount: amountPaise,
      currency: RAZORPAY_CURRENCY,
      keyId: this.keyId,
    };
  }

  /**
   * Reads the ACTUAL fee/tax Razorpay charged on a captured payment, rather
   * than assuming a percentage — Razorpay's own Route integration notes say
   * exactly this ("you must subtract fees and tax to calculate the amount
   * allowed to be transferred"), because the real rate depends on payment
   * method and the merchant's specific plan, not a fixed number.
   */
  async fetchPaymentFees(paymentId: string): Promise<PaymentFees> {
    const payment = await this.client.payments.fetch(paymentId);
    return {
      capturedAmount: Number(payment.amount) / 100,
      fee: Number(payment.fee ?? 0) / 100,
      tax: Number(payment.tax ?? 0) / 100,
    };
  }

  /**
   * *** READ BEFORE GOING LIVE — same caveat as SignzyProvider ***
   * I confirmed Route's overall mechanism (Linked Account -> held Transfer
   * -> release-by-editing-hold) against Razorpay's own docs, and the core
   * REST paths below match what those docs show. What I have NOT
   * independently verified is the complete required field set for creating
   * a Linked Account + Stakeholder (KYC-adjacent business/bank fields vary
   * by account type — individual vs proprietorship vs company). The fields
   * below are a reasonable, typical set for this kind of API, not a
   * confirmed-exact schema. Test against Razorpay's sandbox and adjust
   * field names/requirements against their current Linked Account API
   * reference before relying on this for real seller onboarding.
   */
  async createLinkedAccount(input: LinkedAccountInput): Promise<string> {
    const { data } = await this.http.post('/accounts', {
      email: input.email,
      phone: input.phone,
      type: 'route',
      reference_id: input.sellerUserId,
      legal_business_name: input.name,
      business_type: 'individual',
      contact_name: input.name,
      profile: {
        category: 'ecommerce',
        subcategory: 'ecommerce',
      },
    });
    const accountId: string = data.id;

    // Bank details go on as a "stakeholder" sub-resource in Route's actual
    // model — see the caveat above regarding exact field confirmation.
    await this.http.post(`/accounts/${accountId}/stakeholders`, {
      name: input.beneficiaryName,
      email: input.email,
      kyc: {},
      bank_account: {
        name: input.beneficiaryName,
        ifsc_code: input.bankIfsc,
        account_number: input.bankAccountNumber,
      },
    });

    return accountId;
  }

  /**
   * Creates a Route transfer from an already-captured payment to the
   * seller's linked account, held indefinitely (on_hold, no on_hold_until)
   * until releaseTransfer() is explicitly called later — this is what
   * actually implements "funds held by the platform... released once the
   * buyer confirms delivery, or after a fixed window" (PRD §4.5).
   */
  async createHeldTransfer(
    paymentId: string,
    linkedAccountId: string,
    amountRupees: number,
  ): Promise<string> {
    const { data } = await this.http.post(`/payments/${paymentId}/transfers`, {
      transfers: [
        {
          account: linkedAccountId,
          amount: Math.round(amountRupees * 100),
          currency: RAZORPAY_CURRENCY,
          on_hold: true,
        },
      ],
    });
    return data.items[0].id;
  }

  /** Releases a previously-held transfer — the seller's payout actually settles from here. */
  async releaseTransfer(transferId: string): Promise<void> {
    await this.http.patch(`/transfers/${transferId}`, { on_hold: false });
  }

  /**
   * Reverses a held (not yet released) transfer entirely — used when a
   * dispute results in a refund and the seller's original payout needs to
   * be cancelled rather than released. A NEW transfer for any reduced
   * (partial-refund) amount is created separately by EscrowService, since
   * Razorpay's transfer amount can't be edited in place, only reversed and
   * recreated.
   */
  async reverseTransfer(transferId: string): Promise<void> {
    await this.http.post(`/transfers/${transferId}/reversals`, {});
  }

  /**
   * Full or partial refund of a captured payment — used for the
   * cascade-exhausted entry-fee refund case (Phase 4) and, later, dispute
   * resolutions (Phase 6).
   */
  async refundPayment(paymentId: string, amountRupees: number): Promise<string> {
    const refund = await this.client.payments.refund(paymentId, {
      amount: Math.round(amountRupees * 100),
    });
    return refund.id;
  }

  /**
   * Checkout-form signature (instant client-side confirmation path) — per
   * Razorpay docs: HMAC-SHA256 of "order_id|payment_id" using key_secret.
   * https://razorpay.com/docs/payments/third-party-validation/standard-integration/
   */
  verifyCheckoutSignature(orderId: string, paymentId: string, signature: string): boolean {
    const expected = createHmac('sha256', this.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return this.safeCompare(expected, signature);
  }

  /**
   * Webhook signature — per Razorpay docs: HMAC-SHA256 of the raw request
   * body using the separate webhook secret (not key_secret), sent as
   * `x-razorpay-signature`. Razorpay's own recommendation is to treat
   * webhooks as the source of truth for automation and use the checkout
   * signature only for instant UI feedback — we implement both and let
   * whichever arrives first mark the payment paid (idempotently).
   */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!this.webhookSecret) {
      this.logger.warn('RAZORPAY_WEBHOOK_SECRET is not set — rejecting unsigned webhook');
      return false;
    }
    const expected = createHmac('sha256', this.webhookSecret).update(rawBody).digest('hex');
    return this.safeCompare(expected, signature);
  }

  private safeCompare(expected: string, actual: string): boolean {
    if (!actual) return false;
    const expBuf = Buffer.from(expected);
    const actBuf = Buffer.from(actual);
    if (expBuf.length !== actBuf.length) return false;
    return timingSafeEqual(expBuf, actBuf);
  }
}
