import { api } from "./api/client";

export type EntryPaymentResponse = {
  paymentId: string;
  auctionId: string;
  status: string;
};

export type PlaceBidRequest = {
  amount: number;
};

export type Bid = {
  id: string;
  auctionId: string;
  bidderId?: string;
  bidderDisplayName: string;
  amount: number;
  createdAt: string;
};

export type BidHistoryResponse = {
  bids: Bid[];
};

export const biddingService = {
  unlockBidding(
    auctionId: string,
  ): Promise<EntryPaymentResponse> {
    return api.post<
      EntryPaymentResponse,
      Record<string, never>
    >(
      `/auctions/${auctionId}/entry-payment`,
      {},
    );
  },

  placeBid(
    auctionId: string,
    payload: PlaceBidRequest,
  ): Promise<Bid> {
    return api.post<Bid, PlaceBidRequest>(
      `/auctions/${auctionId}/bids`,
      payload,
    );
  },

  getBidHistory(
    auctionId: string,
  ): Promise<BidHistoryResponse> {
    return api.get<BidHistoryResponse>(
      `/auctions/${auctionId}/bids`,
    );
  },
};