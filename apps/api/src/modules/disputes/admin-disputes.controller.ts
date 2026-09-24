import { Body, Controller, Get, Param, ParseUUIDPipe, Put, Query, UseGuards } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/disputes')
export class AdminDisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Get()
  list(@Query('status') status?: string) {
    // Query params bypass DTO Transform decorators, so uppercased by hand
    // here — same reasoning as everywhere else in common/utils/enum-case.ts.
    const normalized = status?.toUpperCase() as 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | undefined;
    return this.disputesService.list(normalized);
  }

  /**
   * Not in the PRD's enumerated endpoint list, but needed for Phase 6's own
   * "done when": one screen with both photo sets + the verification
   * checklist. This is that screen's data source.
   */
  @Get(':id')
  getDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.disputesService.getDetail(id);
  }

  @Put(':id/resolve')
  resolve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() admin: AuthenticatedUser,
    @Body() dto: ResolveDisputeDto,
  ) {
    return this.disputesService.resolve(id, admin.id, dto);
  }
}
