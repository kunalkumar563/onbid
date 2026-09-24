import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { CreateVerifierDto } from './dto/create-verifier.dto';
import { ScheduleVerificationDto } from './dto/schedule-verification.dto';
import { CompleteVerificationDto } from './dto/complete-verification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

// Route prefix is "verifiers" (not "verification") to match the PRD's
// documented API surface exactly: /api/verifiers/me/queue, etc.
@Controller('verifiers')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  /**
   * Not in the PRD's enumerated API list — added because Phase 2 needs some
   * way to actually create a verifier to be testable at all. Full admin
   * tooling (reassignment, deactivation, etc.) is Phase 6; this is
   * deliberately minimal.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  createVerifier(@Body() dto: CreateVerifierDto) {
    return this.verificationService.createVerifier(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VERIFIER')
  @Get('me/queue')
  getQueue(@CurrentUser() user: AuthenticatedUser) {
    return this.verificationService.getQueue(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VERIFIER')
  @Put('requests/:id/schedule')
  schedule(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ScheduleVerificationDto,
  ) {
    return this.verificationService.schedule(id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VERIFIER')
  @Put('requests/:id/complete')
  complete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CompleteVerificationDto,
  ) {
    return this.verificationService.complete(id, user.id, dto);
  }
}
