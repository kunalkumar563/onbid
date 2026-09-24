import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { readFileSync } from 'fs';
import { join } from 'path';
import { REDIS_CLIENT } from '../../database/redis.module';
import { bidKeys } from './bidding.constants';

const COMPARE_AND_SET_SCRIPT = readFileSync(
  join(__dirname, 'scripts', 'bid-compare-and-set.lua'),
  'utf8',
);
const ROLLBACK_SCRIPT = readFileSync(join(__dirname, 'scripts', 'bid-rollback.lua'), 'utf8');

export interface BidAttemptResult {
  accepted: boolean;
  /** On success: the new current bid. On failure: the (unchanged) current bid. */
  currentBid: number;
  /** On success: the previous bid amount (or startingPrice if this was the opening bid). On failure: the minimum bid that would have been accepted. */
  extra: number;
  /** On success only: who held the previous bid, or null if this was the opening bid — needed for an accurate rollback. */
  previousBidderId: string | null;
}

// Extend ioredis's type with the custom commands we define at startup —
// ioredis has no way to know about these until defineCommand() runs.
type RedisWithCustomCommands = Redis & {
  bidCompareAndSet(
    currentBidKey: string,
    currentBidderKey: string,
    proposedAmount: number,
    bidderId: string,
    startingPrice: number,
  ): Promise<[number, string, string, string]>;
  bidRollback(
    currentBidKey: string,
    currentBidderKey: string,
    valueToUndo: number,
    restoreValue: number,
    restoreBidderId: string,
  ): Promise<number>;
};

@Injectable()
export class BidLockService implements OnModuleInit {
  private redis: RedisWithCustomCommands;

  constructor(@Inject(REDIS_CLIENT) redis: Redis) {
    this.redis = redis as RedisWithCustomCommands;
  }

  onModuleInit() {
    // ioredis computes the SHA1 once and uses EVALSHA on every subsequent
    // call (falling back to EVAL transparently if Redis ever reports
    // NOSCRIPT, e.g. after a Redis restart) — this is the standard,
    // efficient way to run a fixed Lua script repeatedly.
    this.redis.defineCommand('bidCompareAndSet', {
      numberOfKeys: 2,
      lua: COMPARE_AND_SET_SCRIPT,
    });
    this.redis.defineCommand('bidRollback', {
      numberOfKeys: 2,
      lua: ROLLBACK_SCRIPT,
    });
  }

  async tryAcceptBid(
    auctionId: string,
    bidderId: string,
    amount: number,
    startingPrice: number,
  ): Promise<BidAttemptResult> {
    const [successFlag, value, extra, previousBidderId] = await this.redis.bidCompareAndSet(
      bidKeys.currentBid(auctionId),
      bidKeys.currentBidder(auctionId),
      amount,
      bidderId,
      startingPrice,
    );
    return {
      accepted: Number(successFlag) === 1,
      currentBid: Number(value),
      extra: Number(extra),
      previousBidderId: previousBidderId || null,
    };
  }

  /**
   * Called by BiddingService only when Redis accepted a bid but the
   * subsequent Postgres write then failed. `valueToUndo` is the value Redis
   * was just set to; `restoreValue`/`restoreBidderId` is what it should go
   * back to. Pass restoreBidderId = null if this was the auction's first
   * bid (nothing to restore to — the keys get deleted instead).
   */
  async rollback(
    auctionId: string,
    valueToUndo: number,
    restoreValue: number,
    restoreBidderId: string | null,
  ): Promise<boolean> {
    const result = await this.redis.bidRollback(
      bidKeys.currentBid(auctionId),
      bidKeys.currentBidder(auctionId),
      valueToUndo,
      restoreValue,
      restoreBidderId ?? '',
    );
    return Number(result) === 1;
  }
}
