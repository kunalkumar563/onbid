import { Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { EscrowService } from './escrow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

// Not enumerated in the PRD's API list (§6 jumps straight from bidding to
// shipping endpoints) — filled in following the same /api/transactions/:id/*
// shape the shipping endpoints already use, since they clearly share one
// resource.
@Controller('transactions')
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  // Must come before the ":id" route below, or Nest will match "mine" as an id.
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  listMine(@CurrentUser() user: AuthenticatedUser) {
    return this.escrowService.listMine(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const transaction = await this.escrowService.getForParticipant(id, user.id);
    // Lowercased here at the controller boundary, not in the service's raw
    // methods — those are used internally by other services (shipping,
    // disputes) that need the real uppercase Prisma values to compare
    // against, same reasoning as ListingsService.findOne vs findOneRaw.
    return {
      ...transaction,
      status: transaction.status.toLowerCase(),
      payoutStatus: transaction.payoutStatus.toLowerCase(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/pay')
  pay(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.escrowService.getPaymentOrder(id, user.id);
  }

  /**
   * Phase 4's literal "done when": manual release must actually trigger a
   * real payout. Admin-gated for now — Phase 6 may relocate this under a
   * dedicated admin surface, but the underlying call doesn't change.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/release')
  release(@Param('id') id: string) {
    return this.escrowService.release(id);
  }
}
