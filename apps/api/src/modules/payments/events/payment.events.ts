export class VerificationFeePaidEvent {
  constructor(
    public readonly listingId: string,
    public readonly sellerId: string,
    public readonly verificationFeePaymentId: string,
  ) {}
}

export class EntryFeePaidEvent {
  constructor(
    public readonly auctionId: string,
    public readonly userId: string,
  ) {}
}

/** Emitted once the winning bidder's payment for a Transaction is confirmed - EscrowModule listens to create the held Route transfer and write the HELD ledger entry. */
export class TransactionPaidEvent {
  constructor(
    public readonly transactionId: string,
    public readonly razorpayPaymentId: string,
  ) {}
}
