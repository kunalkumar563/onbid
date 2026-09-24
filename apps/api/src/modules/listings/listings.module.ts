import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { PaymentsModule } from '../payments/payments.module';
import { KycModule } from '../kyc/kyc.module';

@Module({
  imports: [PaymentsModule, KycModule],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
