/**
 * Both fees are flat ₹49 per PRD §4.4 (entry fee) and the Phase 2 build doc
 * (verification fee). Kept as named constants, not inlined, since "flat ₹49"
 * is a product decision that could change — one place to update it.
 */
export const VERIFICATION_FEE_RUPEES = 49;
export const ENTRY_FEE_RUPEES = 49;

// Build-phases doc, Phase 4: "Commission (7%)" — explicit, not a guess.
export const COMMISSION_RATE = 0.07;

// PRD §4.5: "Winning bidders have 48 hours to complete full payment."
export const PAYMENT_WINDOW_HOURS = 48;

// Build-phases doc, Phase 4: "Auto-release job (BullMQ scheduled, e.g. 3
// days post-delivery-confirmation)" — the "e.g." reads as the intended
// default, not an open question, so that's what this codes against.
export const AUTO_RELEASE_DAYS = 3;

export const RAZORPAY_CURRENCY = 'INR';

/** Event names emitted once a Razorpay payment is confirmed (webhook or client-verify). */
export const PAYMENT_EVENTS = {
  VERIFICATION_FEE_PAID: 'payment.verification_fee.paid',
  ENTRY_FEE_PAID: 'payment.entry_fee.paid',
  TRANSACTION_PAID: 'payment.transaction.paid',
} as const;
