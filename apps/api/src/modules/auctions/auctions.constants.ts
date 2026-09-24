/**
 * PRD §4.4 bid increment table:
 *   ₹2,500–₹4,999   -> ₹100
 *   ₹5,000–₹9,999   -> ₹250
 *   ₹10,000–₹24,999 -> ₹500
 *   ₹25,000+        -> ₹1,000
 *
 * *** GAP FLAGGED FOR PRODUCT CONFIRMATION ***
 * The PRD's table starts at ₹2,500, but Stationery (₹300 floor) and Fashion
 * Accessories (₹500 floor) auctions can run well below that with no defined
 * tier. BELOW_2500_INCREMENT is a placeholder, not a documented decision —
 * confirm the real number before auctions in those categories go live with
 * real money on the line. It's isolated here as one constant specifically so
 * changing it later is a one-line edit, not a re-architecture.
 */
export const BELOW_2500_INCREMENT = 50;

export function getMinimumIncrement(currentBid: number): number {
  if (currentBid >= 25000) return 1000;
  if (currentBid >= 10000) return 500;
  if (currentBid >= 5000) return 250;
  if (currentBid >= 2500) return 100;
  return BELOW_2500_INCREMENT;
}

/**
 * Standard ascending-auction convention (not explicitly spelled out in the
 * PRD): the opening bid just needs to clear the starting price — the
 * increment table applies to bids *after* the first one, relative to the
 * now-current bid.
 */
export function getMinimumNextBid(currentBid: number | null, startingPrice: number): number {
  if (currentBid === null) return startingPrice;
  return currentBid + getMinimumIncrement(currentBid);
}

// PRD §4.4 anti-snipe: a bid in the final 2 minutes extends the auction by
// 2 minutes, capped at 3 extensions total.
export const ANTI_SNIPE_WINDOW_MS = 2 * 60 * 1000;
export const ANTI_SNIPE_EXTENSION_MS = 2 * 60 * 1000;
export const MAX_ANTI_SNIPE_EXTENSIONS = 3;
