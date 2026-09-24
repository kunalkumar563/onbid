import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resendClient: Resend | null = null;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly configured: boolean;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('notifications.resend.apiKey');
    this.fromEmail = this.config.get<string>(
      'notifications.resend.fromEmail',
      'onboarding@resend.dev',
    );
    this.fromName = this.config.get<string>('notifications.resend.fromName', 'Onbid');
    this.configured = !!apiKey;

    if (apiKey) {
      this.resendClient = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY is not set — emails will be skipped');
    }
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    if (!this.configured || !this.resendClient) {
      this.logger.debug(`(Resend not configured) would have emailed ${to}: ${subject}\n${body}`);
      return;
    }
    
    try {
      await this.resendClient.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to,
        subject,
        text: body,
      });
      this.logger.log(`Email successfully sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
    }
  }
}
