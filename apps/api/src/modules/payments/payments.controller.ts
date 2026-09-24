import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CreatePayoutAccountDto } from './dto/create-payout-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /** Sellers call this once, before they can receive any payout. */
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('payout-account')
  createPayoutAccount(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePayoutAccountDto) {
    return this.paymentsService.createPayoutAccount(user.id, dto);
  }

  /** Client calls this immediately after Razorpay Checkout succeeds, for instant UI feedback. */
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('confirm')
  confirm(@Body() dto: ConfirmPaymentDto) {
    return this.paymentsService.confirmCheckoutPayment(dto);
  }

  /**
   * Public by necessity — Razorpay calls this, not a logged-in user. Trust
   * comes from the HMAC signature (verified against the raw body), not auth.
   */
  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  async webhook(@Headers('x-razorpay-signature') signature: string, @Req() req: Request) {
    await this.paymentsService.handleWebhook((req as any).rawBody ?? '', signature);
    return { received: true };
  }
}
