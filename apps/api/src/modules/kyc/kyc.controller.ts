import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { KycService } from './kyc.service';
import { InitiateKycDto } from './dto/initiate-kyc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  initiate(@CurrentUser() user: AuthenticatedUser, @Body() dto: InitiateKycDto) {
    return this.kycService.initiate(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  status(@CurrentUser() user: AuthenticatedUser) {
    return this.kycService.getStatus(user.id);
  }

  /**
   * Public by necessity — the KYC provider calls this, not a logged-in user.
   * No JwtAuthGuard here; trust is established via the provider's webhook
   * signature instead (checked inside KycService/the provider adapter).
   */
  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  async webhook(
    @Body() body: unknown,
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
  ) {
    await this.kycService.handleWebhook(body, headers, (req as any).rawBody ?? '');
    return { received: true };
  }
}
