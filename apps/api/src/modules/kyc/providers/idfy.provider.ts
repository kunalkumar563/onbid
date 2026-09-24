import { Injectable } from '@nestjs/common';
import {
  KycInitiateInput,
  KycInitiateResult,
  KycProvider,
  KycWebhookResult,
} from './kyc-provider.interface';

/**
 * The PRD lists IDfy as an alternative to Signzy but doesn't say which one
 * Onbid is actually contracting with. Rather than guess at IDfy's real API
 * shape too, this is left as a deliberate stub behind the same interface —
 * whoever picks up IDfy integration writes this class exactly like
 * SignzyProvider and flips KYC_PROVIDER=idfy in .env. Nothing else in the
 * app needs to change.
 */
@Injectable()
export class IdfyProvider implements KycProvider {
  async initiateVerification(_input: KycInitiateInput): Promise<KycInitiateResult> {
    throw new Error(
      'IdfyProvider is not implemented yet. Set KYC_PROVIDER=signzy, or implement this class ' +
        "against IDfy's API docs (same shape as SignzyProvider).",
    );
  }

  parseWebhook(
    _payload: unknown,
    _headers: Record<string, string>,
    _rawBody: string,
  ): KycWebhookResult {
    throw new Error('IdfyProvider is not implemented yet.');
  }
}
