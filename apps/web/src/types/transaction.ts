export type PayoutStatus =
  | "held"
  | "released"
  | "withheld";

export type TransactionStatus =
  | "payment_pending"
  | "paid"
  | "shipping_pending"
  | "shipped"
  | "delivered"
  | "disputed"
  | "completed"
  | "cancelled";

export type Transaction = {
  id: string;

  auctionId: string;
  listingId: string;

  buyerId: string;
  sellerId: string;

  winningAmount: number;

  status: TransactionStatus;

  payoutStatus: PayoutStatus;

  payoutReleasedAt?: string | null;

  createdAt: string;
  updatedAt: string;
};