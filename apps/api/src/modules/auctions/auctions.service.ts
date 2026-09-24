import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AUCTION_EVENTS, AuctionActivatedEvent, AuctionEndedEvent } from './events/auction.events';
import {
  ANTI_SNIPE_EXTENSION_MS,
  ANTI_SNIPE_WINDOW_MS,
  getMinimumNextBid,
  MAX_ANTI_SNIPE_EXTENSIONS,
} from './auctions.constants';

export const AUCTION_LIFECYCLE_QUEUE = 'auction-lifecycle';

export interface AcceptedBidResult {
  bid: { id: string; amount: number; bidderId: string; createdAt: Date };
  auction: {
    id: string;
    currentBid: number;
    currentBidderId: string;
    endTime: Date | null;
    extensionsUsed: number;
  };
  wasExtended: boolean;
}

@Injectable()
export class AuctionsService {
  private readonly logger = new Logger(AuctionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(AUCTION_LIFECYCLE_QUEUE) private readonly lifecycleQueue: Queue,
    private readonly events: EventEmitter2,
  ) {}

  async computeMinimumNextBid(auctionId: string): Promise<number> {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      select: { currentBid: true, startingPrice: true },
    });
    if (!auction) throw new NotFoundException('Auction not found');
    return getMinimumNextBid(
      auction.currentBid ? Number(auction.currentBid) : null,
      Number(auction.startingPrice),
    );
  }

  /**
   * Called ONLY after the Redis Lua compare-and-set has already accepted the
   * bid (see BiddingService) — this method's job is to durably persist that
   * decision, not re-decide it. It still re-checks against Postgres's own
   * currentBid as a final authority per tech stack §3 ("if Redis and
   * Postgres ever disagree, Postgres wins") — if somehow they've drifted,
   * this throws and the caller is expected to roll back the Redis value it
   * just set (see BiddingService.placeBid).
   */
  async recordAcceptedBid(
    auctionId: string,
    bidderId: string,
    amount: number,
  ): Promise<AcceptedBidResult> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const auction = await tx.auction.findUnique({ where: { id: auctionId } });
      if (!auction) throw new NotFoundException('Auction not found');

      if (auction.currentBid !== null && amount <= Number(auction.currentBid)) {
        throw new ConflictException(
          'Bid no longer exceeds the current bid on record — Postgres is authoritative',
        );
      }

      const bid = await tx.bid.create({ data: { auctionId, bidderId, amount } });

      let endTime = auction.endTime;
      let extensionsUsed = auction.extensionsUsed;
      let wasExtended = false;

      if (endTime && extensionsUsed < MAX_ANTI_SNIPE_EXTENSIONS) {
        const msRemaining = endTime.getTime() - Date.now();
        if (msRemaining <= ANTI_SNIPE_WINDOW_MS) {
          endTime = new Date(endTime.getTime() + ANTI_SNIPE_EXTENSION_MS);
          extensionsUsed += 1;
          wasExtended = true;
        }
      }

      const updated = await tx.auction.update({
        where: { id: auctionId },
        data: { currentBid: amount, currentBidderId: bidderId, endTime, extensionsUsed },
      });

      return {
        bid: {
          id: bid.id,
          amount: Number(bid.amount),
          bidderId: bid.bidderId,
          createdAt: bid.createdAt,
        },
        auction: {
          id: updated.id,
          currentBid: Number(updated.currentBid),
          currentBidderId: updated.currentBidderId as string,
          endTime: updated.endTime,
          extensionsUsed: updated.extensionsUsed,
        },
        wasExtended,
      };
    });
  }

  /** Called by VerificationService once a verifier submits PASSED/FAILED. */
  async handleVerificationOutcome(auctionId: string, verdict: 'PASSED' | 'FAILED'): Promise<void> {
    if (verdict === 'FAILED') {
      await this.prisma.auction.update({
        where: { id: auctionId },
        data: { status: 'REJECTED', verificationStatus: 'FAILED' },
      });
      return;
    }

    const auction = await this.prisma.auction.update({
      where: { id: auctionId },
      data: { status: 'VERIFIED', verificationStatus: 'PASSED' },
    });

    const now = new Date();
    if (!auction.requestedStartTime || auction.requestedStartTime <= now) {
      await this.activateAuction(auctionId);
    } else {
      const delay = auction.requestedStartTime.getTime() - now.getTime();
      await this.lifecycleQueue.add(
        'activate',
        { auctionId },
        { delay, jobId: `activate:${auctionId}`, removeOnComplete: true },
      );
    }
  }

  /** Flips a VERIFIED auction live. Idempotent — safe if a job fires twice. */
  async activateAuction(auctionId: string): Promise<void> {
    const auction = await this.prisma.auction.findUnique({ where: { id: auctionId } });
    if (!auction || auction.status !== 'VERIFIED') {
      this.logger.debug(`activateAuction(${auctionId}) skipped — status is ${auction?.status}`);
      return;
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + auction.durationHours * 60 * 60 * 1000);

    await this.prisma.auction.update({
      where: { id: auctionId },
      data: { status: 'ACTIVE', startTime, endTime },
    });

    await this.lifecycleQueue.add(
      'close',
      { auctionId },
      {
        delay: auction.durationHours * 60 * 60 * 1000,
        jobId: `close:${auctionId}`,
        removeOnComplete: true,
      },
    );

    this.events.emit(AUCTION_EVENTS.ACTIVATED, new AuctionActivatedEvent(auctionId, endTime));
  }

  /**
   * Ends an ACTIVE auction. Anti-snipe may have pushed endTime later than
   * when this job was scheduled for — if so, this reschedules itself for the
   * new endTime instead of closing early. Idempotent for the same reason.
   */
  async closeAuction(auctionId: string): Promise<void> {
    const auction = await this.prisma.auction.findUnique({ where: { id: auctionId } });
    if (!auction || auction.status !== 'ACTIVE') {
      this.logger.debug(`closeAuction(${auctionId}) skipped — status is ${auction?.status}`);
      return;
    }

    if (auction.endTime && auction.endTime.getTime() > Date.now()) {
      const delay = auction.endTime.getTime() - Date.now();
      this.logger.log(
        `closeAuction(${auctionId}) fired early due to anti-snipe extension — rescheduling in ${delay}ms`,
      );
      await this.lifecycleQueue.add(
        'close',
        { auctionId },
        { delay, jobId: `close:${auctionId}`, removeOnComplete: true },
      );
      return;
    }

    // No bids at all — nothing to sell, no Transaction to create. Straight
    // to CANCELLED rather than ENDED, since ENDED implies "has a winner
    // awaiting payment" everywhere else in the system (EscrowModule's
    // AUCTION_EVENTS.ENDED listener only creates a Transaction when there's
    // a winningBidderId).
    const finalStatus = auction.currentBidderId ? 'ENDED' : 'CANCELLED';
    await this.prisma.auction.update({ where: { id: auctionId }, data: { status: finalStatus } });

    this.events.emit(
      AUCTION_EVENTS.ENDED,
      new AuctionEndedEvent(
        auctionId,
        auction.currentBidderId,
        auction.currentBid ? Number(auction.currentBid) : null,
        auction.title,
      ),
    );
    // Phase 4 takes it from here: create the Transaction for
    // (auction.currentBidderId, auction.currentBid) and start the buyer's
    // payment/escrow window. Not built yet — out of scope for Phase 3.
  }
}
