export const bidKeys = {
  currentBid: (auctionId: string) => `auction:${auctionId}:current_bid`,
  currentBidder: (auctionId: string) => `auction:${auctionId}:current_bidder`,
  eventStream: (auctionId: string) => `auction:${auctionId}:events`,
};

// Reconnect replay is a short-term catch-up mechanism, not permanent
// history (Postgres/the Bid table is permanent history, via GET
// /auctions/:id/bids) — cap the stream so it can't grow unbounded on a
// long-running, heavily-bid auction.
export const EVENT_STREAM_MAXLEN = 1000;

export const SOCKET_EVENTS = {
  BID_PLACED: 'bidPlaced',
  BID_REJECTED: 'bidRejected',
  AUCTION_ENDED: 'auctionEnded',
} as const;
