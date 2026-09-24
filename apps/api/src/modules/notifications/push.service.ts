import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private app: App | null = null;

  constructor(private readonly config: ConfigService) {
    const serviceAccountJson = this.config.get<string>('notifications.fcm.serviceAccountJson');
    if (!serviceAccountJson) {
      this.logger.warn('FCM_SERVICE_ACCOUNT_JSON is not set — push notifications will be skipped');
      return;
    }
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      this.app = initializeApp({ credential: cert(serviceAccount) });
    } catch (err) {
      this.logger.error(
        'Failed to initialize firebase-admin — check FCM_SERVICE_ACCOUNT_JSON is valid JSON',
        err instanceof Error ? err.stack : undefined,
      );
    }
  }

  /** Sends to every registered device for a user; a token rejected as invalid/unregistered is reported back so the caller can prune it. */
  async sendToTokens(
    tokens: string[],
    title: string,
    body: string,
  ): Promise<{ successCount: number; invalidTokens: string[] }> {
    if (!this.app || tokens.length === 0) {
      return { successCount: 0, invalidTokens: [] };
    }

    // sendEachForMulticast is the current firebase-admin API for this (the
    // older sendMulticast was renamed) — confirmed via Firebase's own docs
    // rather than assumed from memory, since API surface like this changes.
    const response = await getMessaging(this.app).sendEachForMulticast({
      tokens,
      notification: { title, body },
    });

    const invalidTokens: string[] = [];
    response.responses.forEach((r, i) => {
      if (!r.success && r.error) {
        const code = r.error.code;
        if (
          code === 'messaging/registration-token-not-registered' ||
          code === 'messaging/invalid-argument'
        ) {
          invalidTokens.push(tokens[i]);
        }
      }
    });

    return { successCount: response.successCount, invalidTokens };
  }
}
