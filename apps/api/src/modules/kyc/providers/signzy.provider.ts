import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { createHmac, timingSafeEqual } from 'crypto';
import {
  KycInitiateInput,
  KycInitiateResult,
  KycProvider,
  KycVerdictStatus,
  KycWebhookResult,
} from './kyc-provider.interface';

/**
 * *** READ BEFORE GOING LIVE ***
 * Signzy's actual API docs live behind an account-gated knowledge portal —
 * exact endpoint paths, request/response field names, and webhook signing
 * scheme depend on which products your contract includes (PAN vs Aadhaar
 * e-KYC are often separate products with separate paths). Everything marked
 * "PLACEHOLDER" below follows Signzy's publicly-documented general pattern
 * (username+apiKey -> access token -> authenticated REST call -> webhook
 * callback with the verdict) but has NOT been verified against a live
 * account, because this build has no Signzy credentials to test with.
 *
 * Before Phase 1 is actually "done" per the build-phases doc ("a real
 * PAN/Aadhaar can be submitted and comes back verified/rejected through the
 * actual provider"), whoever has Signzy account access needs to:
 *   1. Swap the PLACEHOLDER paths/payloads below for the real ones from the docs portal.
 *   2. Confirm the webhook signing scheme and update verifySignature() to match.
 *   3. Run one real PAN and one real Aadhaar check against their sandbox.
 */
@Injectable()
export class SignzyProvider implements KycProvider {
  private readonly logger = new Logger(SignzyProvider.name);
  private readonly http: AxiosInstance;
  private readonly webhookSecret?: string;

  private accessToken: string | null = null;
  private accessTokenExpiresAt = 0;

  constructor(private readonly config: ConfigService) {
    this.http = axios.create({ baseURL: this.config.get<string>('kyc.signzy.baseUrl') });
    this.webhookSecret = this.config.get<string>('kyc.signzy.webhookSecret');
  }

  /** Signzy auth is username+apiKey -> short-lived access token (PLACEHOLDER path). */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.accessTokenExpiresAt) {
      return this.accessToken;
    }
    const username = this.config.get<string>('kyc.signzy.username');
    const apiKey = this.config.get<string>('kyc.signzy.apiKey');
    if (!username || !apiKey) {
      throw new Error('SIGNZY_USERNAME / SIGNZY_API_KEY are not configured');
    }

    // PLACEHOLDER — confirm exact path/body against the account's docs portal.
    const { data } = await this.http.post('/api/v2/login', { username, password: apiKey });
    this.accessToken = data.id || data.accessToken;
    // Signzy tokens are commonly ~24h; refresh 5 min early to be safe.
    this.accessTokenExpiresAt = Date.now() + 23.5 * 60 * 60 * 1000;
    return this.accessToken as string;
  }

  async initiateVerification(input: KycInitiateInput): Promise<KycInitiateResult> {
    const token = await this.getAccessToken();

    // PLACEHOLDER — real Signzy PAN/Aadhaar product paths differ by contract.
    const path = input.documentType === 'pan' ? '/api/v3/pan/verify' : '/api/v2/aadhaar/verify';

    try {
      const { data } = await this.http.post(
        path,
        {
          number: input.documentNumber,
          name: input.fullName,
          dob: input.dateOfBirth,
          callbackUrl: this.config.get<string>('kyc.signzy.callbackUrl'),
        },
        { headers: { Authorization: token } },
      );

      return {
        providerRefId: data.id || data.referenceId,
        status: this.mapStatus(data.status || data.verificationStatus),
        raw: data,
      };
    } catch (err) {
      this.logger.error(
        `Signzy ${input.documentType} verification call failed`,
        err instanceof Error ? err.stack : undefined,
      );
      throw err;
    }
  }

  parseWebhook(
    payload: unknown,
    headers: Record<string, string>,
    rawBody: string,
  ): KycWebhookResult {
    this.verifySignature(headers, rawBody);

    const body = payload as Record<string, unknown>;
    return {
      providerRefId: String(body.id ?? body.referenceId ?? ''),
      status: this.mapStatus(String(body.status ?? body.verificationStatus ?? '')),
      raw: body,
    };
  }

  /**
   * PLACEHOLDER signature scheme: HMAC-SHA256 of the raw request body using a
   * shared secret, sent as `x-signzy-signature`. This is a reasonable
   * minimum bar — an unsigned webhook that can flip someone's KYC status
   * must not be trusted — but confirm Signzy's actual signing header/
   * algorithm and replace this before relying on it in production.
   */
  private verifySignature(headers: Record<string, string>, rawBody: string): void {
    if (!this.webhookSecret) {
      this.logger.warn(
        'SIGNZY_WEBHOOK_SECRET is not set — refusing to trust unsigned KYC webhooks',
      );
      throw new UnauthorizedException('KYC webhook signature verification is not configured');
    }
    const signature = headers['x-signzy-signature'];
    if (!signature) throw new UnauthorizedException('Missing webhook signature');

    const expected = createHmac('sha256', this.webhookSecret).update(rawBody).digest('hex');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }

  private mapStatus(raw: string): KycVerdictStatus {
    const normalized = (raw || '').toLowerCase();
    if (['verified', 'success', 'approved', 'passed'].includes(normalized)) return 'VERIFIED';
    if (['rejected', 'failed', 'error', 'declined'].includes(normalized)) return 'REJECTED';
    return 'PENDING';
  }
}
