import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { PredispatchPhotosDto } from './dto/predispatch-photos.dto';
import { DeliveryConfirmationDto } from './dto/delivery-confirmation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@Controller('transactions')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/predispatch-photos')
  submitPredispatch(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: PredispatchPhotosDto,
  ) {
    return this.shippingService.submitPredispatchPhotos(id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/delivery-confirmation')
  confirmDelivery(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: DeliveryConfirmationDto,
  ) {
    return this.shippingService.confirmDelivery(id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/proof')
  getProof(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.shippingService.getProof(id, user.id);
  }
}
