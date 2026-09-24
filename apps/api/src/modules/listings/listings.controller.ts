import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListActiveQueryDto } from './dto/list-active-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { KycVerifiedGuard } from '../kyc/guards/kyc-verified.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateListingDto) {
    return this.listingsService.create(user.id, dto);
  }

  /** Public browse of live auctions — no auth required to look around. */
  @Get()
  findActive(@Query() query: ListActiveQueryDto) {
    return this.listingsService.findActive(query.category, query.page, query.pageSize);
  }

  // Must come before the ":id" route below, or Nest will match "mine"/"me" as an id.
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.listingsService.findMine(user.id);
  }

  /** Alias for /mine — the frontend's listing.ts service calls this exact path. */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMineAlias(@CurrentUser() user: AuthenticatedUser) {
    return this.listingsService.findMine(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard, KycVerifiedGuard)
  @Post(':id/request-verification')
  requestVerification(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.listingsService.requestVerification(id, user.id);
  }
}
