import { Body, ConflictException, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BiddingService } from './bidding.service';
import { PlaceBidDto } from './dto/place-bid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

// Route prefix matches the PRD's documented /api/auctions/:id/* paths.
@Controller('auctions')
export class BiddingController {
  constructor(private readonly biddingService: BiddingService) {}

  /**
   * Not in the PRD's enumerated endpoint list, but the frontend's
   * AuctionDetail page calls this exact path directly — see
   * BiddingService.getAuctionDetail for the Listing-vs-Auction shape split.
   */
  @Get(':id')
  getAuctionDetail(@Param('id') auctionId: string) {
    return this.biddingService.getAuctionDetail(auctionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/entry-payment')
  createEntryPayment(@Param('id') auctionId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.biddingService.createEntryPayment(auctionId, user.id);
  }

  /**
   * REST entry point into the same BiddingService.placeBid the WebSocket
   * gateway uses (see bidding.gateway.ts) — the PRD documents this as a REST
   * endpoint; the tech stack doc describes bids "over the socket." Both are
   * legitimate transports into one shared, non-duplicated decision path.
   *
   * A rejected bid (too low) is surfaced as a normal HTTP error here, not a
   * 200 with an `accepted: false` body — the frontend's Bid type has no
   * concept of rejection and its api client's error handling already
   * expects a thrown ApiError on non-2xx. The socket gateway's ack callback
   * keeps using the richer `accepted` shape, since that's a different
   * transport with different client expectations.
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/bids')
  async placeBid(
    @Param('id') auctionId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: PlaceBidDto,
  ) {
    const result = await this.biddingService.placeBid(auctionId, user.id, dto.amount);
    if (!result.accepted) {
      throw new ConflictException(
        `Bid too low — current bid is ₹${result.currentBid}, minimum next bid is ₹${result.minimumNextBid}`,
      );
    }
    return result;
  }

  @Get(':id/bids')
  getBidHistory(@Param('id') auctionId: string) {
    return this.biddingService.getBidHistory(auctionId);
  }
}
