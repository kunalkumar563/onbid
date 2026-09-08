export type AuctionStatus =
  | "pending"
  | "scheduled"
  | "live"
  | "ended"
  | "cancelled";

export type Auction = {
  id: string;
  listingId: string;
  sellerId: string;

  title: string;
  category: string;

  startingPrice: number;
  currentBid: number;

  minimumIncrement: number;

  startsAt: string;
  endsAt: string;

  status: AuctionStatus;

  verificationRequestId?: string | null;

  verificationStatus:
    | "pending"
    | "passed"
    | "failed";

  winnerId?: string | null;

  createdAt: string;
  updatedAt: string;
};