export const VERIFICATION_EVENTS = {
  ASSIGNED: 'verification.assigned',
  PASSED: 'verification.passed',
  FAILED: 'verification.failed',
} as const;

export class VerificationAssignedEvent {
  constructor(
    public readonly listingId: string,
    public readonly sellerId: string,
    public readonly listingTitle: string,
  ) {}
}

export class VerificationOutcomeEvent {
  constructor(
    public readonly listingId: string,
    public readonly sellerId: string,
    public readonly listingTitle: string,
    public readonly notes: string | null,
  ) {}
}
