/**
 * STUB — not a real service.
 *
 * AuctioneerBidActivity.tsx imported this file already; it just didn't
 * exist, which meant `npm run build` failed outright before any backend
 * integration work even started. This satisfies that import so the app
 * compiles, without pretending the Auctioneer feature (live manual auction
 * control) is real — it has no backend at all. See the README's frontend
 * notes: this is a genuine future phase, not something to build out here.
 *
 * getBidActivity() always returns an empty list rather than throwing, so
 * the page renders its normal "no activity" empty state instead of an
 * error — an honest "nothing here yet," not a fake success.
 */

export type AuctioneerBidActivityItem = {
  id: string;
  bidderDisplayName: string;
  auctionTitle: string;
  amount: number;
  status: "accepted" | "rejected" | "pending";
  createdAt: string;
};

export type AuctioneerBidActivityResponse = {
  bids: AuctioneerBidActivityItem[];
};

export const auctioneerService = {
  getBidActivity(): Promise<AuctioneerBidActivityResponse> {
    return Promise.resolve({ bids: [] });
  },
};
