import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly configured: boolean;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('notifications.sendgrid.apiKey');
    this.fromEmail = this.config.get<string>(
      'notifications.sendgrid.fromEmail',
      'noreply@onbid.example',
    );
    this.fromName = this.config.get<string>('notifications.sendgrid.fromName', 'Onbid');
    this.configured = !!apiKey;

    if (apiKey) {
      sgMail.setApiKey(apiKey);
    } else {
      this.logger.warn('SENDGRID_API_KEY is not set — emails will be skipped');
    }
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    if (!this.configured) {
      this.logger.debug(`(SendGrid not configured) would have emailed ${to}: ${subject}\n${body}`);
      return;
    }
    await sgMail.send({
      to,
      from: { email: this.fromEmail, name: this.fromName },
      subject,
      text: body,
    });
  }
}
