import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PAYMENT_EVENTS } from '../../payments/payments.constants';
import { VerificationFeePaidEvent } from '../../payments/events/payment.events';
import { VerificationService } from '../verification.service';

@Injectable()
export class PaymentConfirmedListener {
  private readonly logger = new Logger(PaymentConfirmedListener.name);

  constructor(private readonly verificationService: VerificationService) {}

  @OnEvent(PAYMENT_EVENTS.VERIFICATION_FEE_PAID)
  async handleVerificationFeePaid(event: VerificationFeePaidEvent): Promise<void> {
    this.logger.log(`Verification fee paid for listing ${event.listingId} — creating request`);
    await this.verificationService.createRequestFromPaidFee(
      event.listingId,
      event.verificationFeePaymentId,
    );
  }
}
