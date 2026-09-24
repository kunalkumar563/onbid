export const BIDDING_EVENTS = {
  BID_ACCEPTED: 'bid.accepted',
} as const;

export class BidAcceptedEvent {
  constructor(
    public readonly auctionId: string,
    public readonly bidId: string,
    public readonly amount: number,
    public readonly bidderTag: string,
    public readonly createdAt: Date,
    public readonly endTime: Date | null,
    public readonly extensionsUsed: number,
    public readonly wasExtended: boolean,
    /** Only the placing bidder's own socket needs their raw id, to distinguish "you" from other bidders client-side — everyone else only ever sees bidderTag. */
    public readonly bidderId: string,
    /** Who held the previous bid, or null if this was the opening bid — notifications uses this to send OUTBID to exactly the right person. */
    public readonly previousBidderId: string | null,
    /** The previous bidder's own amount (not to be confused with `amount` above, which is the new winning bid) — needed so the OUTBID notification shows their real number, not a duplicate of the new bid. */
    public readonly previousBidAmount: number | null,
    public readonly listingTitle: string,
  ) {}
}
