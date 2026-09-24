import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { AuctionCategory, VerificationRequestStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('verifiers')
  listVerifiers() {
    return this.adminService.listVerifiers();
  }

  @Get('verification-requests')
  getVerificationQueue(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('location') location?: string,
  ) {
    // Raw @Query() params (not bound through a DTO class) skip class-transformer
    // entirely, so uppercased by hand — same reasoning as elsewhere.
    return this.adminService.getVerificationQueue({
      status: status?.toUpperCase() as VerificationRequestStatus | undefined,
      category: category?.toUpperCase() as AuctionCategory | undefined,
      location,
    });
  }
}
