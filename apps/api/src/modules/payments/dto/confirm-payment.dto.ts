import { IsString } from 'class-validator';

/**
 * Exactly the three fields Razorpay Checkout hands back to the client on a
 * successful payment (razorpay_order_id / razorpay_payment_id /
 * razorpay_signature) — the client forwards them here so we can verify
 * before trusting "payment succeeded" for instant UI feedback. See
 * RazorpayService.verifyCheckoutSignature for the actual check.
 */
export class ConfirmPaymentDto {
  @IsString()
  razorpayOrderId: string;

  @IsString()
  razorpayPaymentId: string;

  @IsString()
  razorpaySignature: string;
}
