export type KycDocumentType = 'pan' | 'aadhaar';
export type KycVerdictStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface KycInitiateInput {
  userId: string;
  documentType: KycDocumentType;
  documentNumber: string;
  fullName: string;
  dateOfBirth?: string; // ISO date, required by most PAN-validation APIs
}

export interface KycInitiateResult {
  /** The provider's own tracking id for this attempt — store this, never the document number. */
  providerRefId: string;
  /** Some providers verify PAN synchronously; Aadhaar is almost always async (OTP/callback-based). */
  status: KycVerdictStatus;
  /** If the provider needs an extra step (e.g. Aadhaar OTP), the raw response is passed through for the caller to interpret. */
  raw: Record<string, unknown>;
}

export interface KycWebhookResult {
  providerRefId: string;
  status: KycVerdictStatus;
  raw: Record<string, unknown>;
}

/**
 * Both Signzy and IDfy fit this same shape at a high level: you call an
 * authenticated REST endpoint to start a check, and get the verdict back
 * either inline or via a webhook a moment later. Everything in the app talks
 * to this interface, never to a concrete vendor SDK directly — swapping
 * Signzy for IDfy (or adding a second one) means writing one new class here,
 * nothing else changes.
 */
export interface KycProvider {
  initiateVerification(input: KycInitiateInput): Promise<KycInitiateResult>;

  /**
   * Parses an inbound webhook body into a normalized result. Throws if the
   * payload doesn't carry a valid signature — see each provider's
   * implementation for exactly what "valid" means for that vendor.
   *
   * `rawBody` is the exact bytes of the request body as a string, captured
   * before JSON parsing — HMAC signatures must be verified against the raw
   * bytes the sender signed, not a re-serialized `JSON.stringify(payload)`,
   * which isn't guaranteed to produce the same string (key order, spacing).
   */
  parseWebhook(
    payload: unknown,
    headers: Record<string, string>,
    rawBody: string,
  ): KycWebhookResult;
}

export const KYC_PROVIDER = 'KYC_PROVIDER';
