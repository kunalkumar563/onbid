import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { RazorpayService } from './razorpay.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, RazorpayService],
  // Exported so listings/verification (verification fee) and bidding/auctions
  // (entry fee) can create orders without owning Razorpay plumbing themselves.
  exports: [PaymentsService],
})
export class PaymentsModule {}
