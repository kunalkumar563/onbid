import { Module } from '@nestjs/common';
import { DisputesController } from './disputes.controller';
import { AdminDisputesController } from './admin-disputes.controller';
import { DisputesService } from './disputes.service';
import { EscrowModule } from '../escrow/escrow.module';

@Module({
  imports: [EscrowModule],
  controllers: [DisputesController, AdminDisputesController],
  providers: [DisputesService],
})
export class DisputesModule {}
