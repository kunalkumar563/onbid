import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { PaymentConfirmedListener } from './listeners/payment-confirmed.listener';
import { AuctionsModule } from '../auctions/auctions.module';

@Module({
  imports: [AuctionsModule],
  controllers: [VerificationController],
  providers: [VerificationService, PaymentConfirmedListener],
  exports: [VerificationService],
})
export class VerificationModule {}
