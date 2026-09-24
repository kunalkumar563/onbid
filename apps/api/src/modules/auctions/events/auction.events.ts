export const AUCTION_EVENTS = {
  ACTIVATED: 'auction.activated',
  ENDED: 'auction.ended',
} as const;

export class AuctionActivatedEvent {
  constructor(
    public readonly auctionId: string,
    public readonly endTime: Date,
  ) {}
}

export class AuctionEndedEvent {
  constructor(
    public readonly auctionId: string,
    public readonly winningBidderId: string | null,
    public readonly winningBid: number | null,
    public readonly listingTitle: string,
  ) {}
}
