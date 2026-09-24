import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { EscrowModule } from '../escrow/escrow.module';

@Module({
  imports: [EscrowModule],
  controllers: [ShippingController],
  providers: [ShippingService],
})
export class ShippingModule {}
