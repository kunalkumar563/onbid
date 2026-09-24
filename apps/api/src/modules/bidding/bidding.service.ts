import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { BidLockService } from './bid-lock.service';
import { BidStreamService } from './bid-stream.service';
import { AuctionsService } from '../auctions/auctions.service';
import { PaymentsService } from '../payments/payments.service';
import { anonymizeBidder } from './bidder-anonymizer';
import { BIDDING_EVENTS, BidAcceptedEvent } from './events/bidding.events';
import { getMinimumIncrement } from '../auctions/auctions.constants';

export type PlaceBidResult =
  | {
      accepted: true;
      id: string; // alias for bidId — matches frontend's flat Bid type
      bidId: string;
      auctionId: string;
      bidderDisplayName: string; // alias for bidderTag — same reasoning
      amount: number;
      bidderTag: string;
      createdAt: Date;
      endTime: Date | null;
      extensionsUsed: number;
      wasExtended: boolean;
    }
  | {
      accepted: false;
      currentBid: number;
      minimumNextBid: number;
    };

@Injectable()
export class BiddingService {
  private readonly logger = new Logger(BiddingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly bidLock: BidLockService,
    private readonly bidStream: BidStreamService,
    private readonly auctionsService: AuctionsService,
    private readonly paymentsService: PaymentsService,
    private readonly events: EventEmitter2,
  ) {}

  /**
   * Checked fresh against Postgres rather than trusting a JWT claim — same
   * reasoning as KycVerifiedGuard, restated here because bids can arrive via
   * WebSocket, which doesn't go through the HTTP guard pipeline at all. This
   * is the one place both the REST and WebSocket entry points converge, so
   * it's the right place for the authoritative check to live.
   */
  private async assertKycVerified(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true },
    });
    if (!user || user.kycStatus !== 'VERIFIED') {
      throw new ForbiddenException(
        'PAN and Aadhaar verification must be complete before you can do this',
      );
    }
  }

  private async loadBiddableAuction(auctionId: string, actingUserId: string) {
    const auction = await this.prisma.auction.findUnique({ where: { id: auctionId } });
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.sellerId === actingUserId) {
      throw new ForbiddenException('You cannot bid on your own listing');
    }
    if (auction.status !== 'ACTIVE') {
      throw new BadRequestException(`Auction is not open for bidding (status: ${auction.status})`);
    }
    if (auction.endTime && auction.endTime.getTime() <= Date.now()) {
      throw new BadRequestException('This auction has already ended');
    }
    return auction;
  }

  async createEntryPayment(auctionId: string, userId: string) {
    await this.assertKycVerified(userId);
    const auction = await this.loadBiddableAuction(auctionId, userId);
    const order = await this.paymentsService.createEntryFeeOrder(auction.id, userId);
    return {
      paymentId: order.orderId, // matches frontend's EntryPaymentResponse.paymentId exactly
      auctionId,
      status: order.status, // 'paid' in DEMO_MODE, 'created' otherwise
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId,
    };
  }

  private async hasEntryPaid(auctionId: string, userId: string): Promise<boolean> {
    const payment = await this.prisma.auctionEntryPayment.findUnique({
      where: { auctionId_userId: { auctionId, userId } },
    });
    return payment?.status === 'PAID';
  }

  async getMyBids(userId: string) {
    const auctions = await this.prisma.auction.findMany({
      where: {
        bids: { some: { bidderId: userId } }
      },
      include: {
        bids: { 
          where: { bidderId: userId }, 
          orderBy: { amount: 'desc' }, 
          take: 1 
        }
      },
      orderBy: { endTime: 'asc' }
    });

    return auctions.map(a => ({
      auction: a,
      myHighestBid: a.bids[0]?.amount || 0,
      isWinning: a.currentBidderId === userId
    }));
  }

  async placeBid(auctionId: string, bidderId: string, amount: number): Promise<PlaceBidResult> {
    await this.assertKycVerified(bidderId);
    const auction = await this.loadBiddableAuction(auctionId, bidderId);

    if (!(await this.hasEntryPaid(auctionId, bidderId))) {
      throw new ForbiddenException(
        'You must pay the one-time entry fee before bidding on this auction',
      );
    }

    const attempt = await this.bidLock.tryAcceptBid(
      auctionId,
      bidderId,
      amount,
      Number(auction.startingPrice),
    );

    if (!attempt.accepted) {
      return { accepted: false, currentBid: attempt.currentBid, minimumNextBid: attempt.extra };
    }

    try {
      const recorded = await this.auctionsService.recordAcceptedBid(auctionId, bidderId, amount);
      const bidderTag = anonymizeBidder(bidderId, auctionId);

      await this.bidStream.append(auctionId, {
        bidId: recorded.bid.id,
        amount: String(recorded.bid.amount),
        bidderTag,
        createdAt: recorded.bid.createdAt.toISOString(),
        endTime: recorded.auction.endTime?.toISOString() ?? '',
        extensionsUsed: String(recorded.auction.extensionsUsed),
      });

      this.events.emit(
        BIDDING_EVENTS.BID_ACCEPTED,
        new BidAcceptedEvent(
          auctionId,
          recorded.bid.id,
          recorded.bid.amount,
          bidderTag,
          recorded.bid.createdAt,
          recorded.auction.endTime,
          recorded.auction.extensionsUsed,
          recorded.wasExtended,
          bidderId,
          attempt.previousBidderId,
          attempt.previousBidderId !== null ? attempt.extra : null,
          auction.title,
        ),
      );

      return {
        accepted: true,
        id: recorded.bid.id, // alias for bidId — matches frontend's flat Bid type
        bidId: recorded.bid.id,
        auctionId,
        bidderDisplayName: bidderTag, // alias for bidderTag — same reasoning
        amount: recorded.bid.amount,
        bidderTag,
        createdAt: recorded.bid.createdAt,
        endTime: recorded.auction.endTime,
        extensionsUsed: recorded.auction.extensionsUsed,
        wasExtended: recorded.wasExtended,
      };
    } catch (err) {
      // Redis said yes, Postgres said no — Postgres wins (tech stack §3).
      // Undo the Redis side so it can't drift ahead of the real source of
      // truth, then surface a clear, retryable error to the bidder.
      this.logger.error(
        `Postgres write failed after Redis accepted bid on auction ${auctionId} — rolling back Redis`,
        err instanceof Error ? err.stack : undefined,
      );
      await this.bidLock.rollback(auctionId, amount, attempt.extra, attempt.previousBidderId);
      throw new ConflictException('Your bid could not be recorded — please try again');
    }
  }

  async getBidHistory(auctionId: string) {
    const auction = await this.prisma.auction.findUnique({ where: { id: auctionId } });
    if (!auction) throw new NotFoundException('Auction not found');

    const bids = await this.prisma.bid.findMany({
      where: { auctionId },
      orderBy: { createdAt: 'desc' },
    });
    const shaped = bids.map(
      (b: { id: string; amount: unknown; bidderId: string; createdAt: Date }) => ({
        id: b.id,
        auctionId,
        bidderDisplayName: anonymizeBidder(b.bidderId, auctionId),
        amount: Number(b.amount),
        createdAt: b.createdAt.toISOString(),
      }),
    );
    // Wrapped in { bids: [...] } — matches the frontend's BidHistoryResponse
    // type exactly, rather than a bare array.
    return { bids: shaped };
  }

  /**
   * Reshapes the internal Auction row into the frontend's separate `Auction`
   * type (distinct from `Listing` — see listings.service.ts's equivalent
   * for the Listing-shaped view of this same row). Not in the PRD's
   * enumerated endpoint list, but the frontend's AuctionDetail page calls
   * `GET /auctions/:id` directly, so it needs to exist.
   */
  async getAuctionDetail(auctionId: string) {
    const auction = await this.prisma.auction.findUnique({ where: { id: auctionId } });
    if (!auction) throw new NotFoundException('Auction not found');

    const currentBid = auction.currentBid ? Number(auction.currentBid) : null;
    const startingPrice = Number(auction.startingPrice);

    return {
      id: auction.id,
      listingId: auction.id, // same row — see the Auction/Listing design note in listings.service.ts
      sellerId: auction.sellerId,
      title: auction.title,
      category: auction.category.toLowerCase(),
      startingPrice,
      currentBid: currentBid ?? startingPrice,
      minimumIncrement: getMinimumIncrement(currentBid ?? startingPrice),
      startsAt: (auction.startTime ?? auction.createdAt).toISOString(),
      endsAt: auction.endTime ? auction.endTime.toISOString() : '',
      status: mapToFrontendAuctionStatus(auction.status),
      verificationRequestId: auction.currentVerificationRequestId,
      verificationStatus: auction.verificationStatus.toLowerCase() as
        'pending' | 'passed' | 'failed',
      winnerId: ['ENDED', 'SOLD'].includes(auction.status) ? auction.currentBidderId : null,
      createdAt: auction.createdAt.toISOString(),
      updatedAt: auction.updatedAt.toISOString(),
    };
  }

  async getReplayEvents(auctionId: string, afterStreamId: string) {
    return this.bidStream.getEventsSince(auctionId, afterStreamId);
  }
}

/**
 * My AuctionStatus has 8 values (covering the full pre-auction lifecycle
 * too); the frontend's separate `Auction.status` is a simpler 5-value set
 * describing only the live-auction stage. DRAFT/PENDING_VERIFICATION both
 * collapse to "pending" (not yet a real auction from this view's
 * perspective); SOLD collapses into "ended" (Listing.status is where "sold"
 * vs. plain "ended" actually gets distinguished).
 */
function mapToFrontendAuctionStatus(
  status: string,
): 'pending' | 'scheduled' | 'live' | 'ended' | 'cancelled' {
  switch (status) {
    case 'DRAFT':
    case 'PENDING_VERIFICATION':
      return 'pending';
    case 'VERIFIED':
      return 'scheduled';
    case 'ACTIVE':
      return 'live';
    case 'ENDED':
    case 'SOLD':
      return 'ended';
    case 'REJECTED':
    case 'CANCELLED':
    default:
      return 'cancelled';
  }
}
