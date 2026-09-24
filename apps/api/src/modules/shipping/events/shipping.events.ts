export const SHIPPING_EVENTS = {
  PREDISPATCH_RECORDED: 'shipping.predispatch_recorded',
} as const;

export class PredispatchRecordedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly buyerId: string,
    public readonly listingTitle: string,
    public readonly courierName: string,
    public readonly trackingNumber: string,
  ) {}
}
