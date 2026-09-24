export const ESCROW_EVENTS = {
  TRANSACTION_CREATED: 'escrow.transaction_created',
} as const;

export class TransactionCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly buyerId: string,
    public readonly listingTitle: string,
    public readonly amount: number,
    public readonly paymentDeadline: Date,
  ) {}
}
