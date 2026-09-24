import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EscrowController } from './escrow.controller';
import { EscrowService } from './escrow.service';
import { EscrowLifecycleProcessor } from './jobs/escrow-lifecycle.processor';
import { ESCROW_LIFECYCLE_QUEUE } from './escrow.constants';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [BullModule.registerQueue({ name: ESCROW_LIFECYCLE_QUEUE }), PaymentsModule],
  controllers: [EscrowController],
  providers: [EscrowService, EscrowLifecycleProcessor],
  // Exported for ShippingModule (Phase 5) to call markDelivered() once the
  // buyer uploads their receipt photos.
  exports: [EscrowService],
})
export class EscrowModule {}
