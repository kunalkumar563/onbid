import { COMMISSION_RATE } from '../payments/payments.constants';

export interface PayoutBreakdown {
  commissionAmount: number;
  payoutAmount: number;
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * PRD §4.5: payout = amount - platform commission - payment gateway fee.
 * Commission is a flat 7% (build-phases doc, explicit). `gatewayFee` and
 * `gatewayTax` must be the ACTUAL values Razorpay reported on the captured
 * payment (RazorpayService.fetchPaymentFees) — never an assumed rate, per
 * Razorpay's own Route documentation. This function just does the
 * arithmetic; it doesn't know or care where the fee numbers came from.
 */
export function computePayout(
  amount: number,
  gatewayFee: number,
  gatewayTax: number,
): PayoutBreakdown {
  const commissionAmount = round2(amount * COMMISSION_RATE);
  const payoutAmount = round2(amount - commissionAmount - gatewayFee - gatewayTax);
  return { commissionAmount, payoutAmount };
}
