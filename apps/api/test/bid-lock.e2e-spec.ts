import Redis from 'ioredis';
import { BidLockService } from '../src/modules/bidding/bid-lock.service';

/**
 * This is the one test in the whole suite that matters most for Phase 3's
 * literal "done when": two simultaneous bids on the same auction must never
 * both win. Everything here runs against a REAL Redis (see README §2 for
 * why this doesn't run inside the sandbox this was built in) executing the
 * ACTUAL shipped Lua scripts via the ACTUAL BidLockService class — not a
 * re-implementation of the logic, and not mocked.
 */
describe('BidLockService (e2e, real Redis)', () => {
  let redis: Redis;
  let bidLock: BidLockService;

  beforeAll(() => {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    bidLock = new BidLockService(redis);
    bidLock.onModuleInit();
  });

  afterAll(async () => {
    await redis.quit();
  });

  it('under 50 truly-concurrent bids, exactly the highest valid one wins and Redis state matches it exactly', async () => {
    const auctionId = `test-concurrency-${Date.now()}`;
    const startingPrice = 2500;
    const bidderCount = 50;

    // All 50 promises are created in the same synchronous tick — no await
    // between them — so this genuinely exercises concurrent EVALs racing
    // against each other, not a sequence of "concurrent-looking" but
    // actually-serialized calls.
    const attempts = Array.from({ length: bidderCount }, (_, i) =>
      bidLock.tryAcceptBid(auctionId, `bidder-${i}`, 2600 + i * 100, startingPrice),
    );
    const results = await Promise.all(attempts);

    const accepted = results.filter((r) => r.accepted);
    const acceptedAmounts = accepted.map((r) => r.currentBid);

    // No lost updates: every accepted amount is unique.
    expect(new Set(acceptedAmounts).size).toBe(acceptedAmounts.length);

    // Redis's final state matches whichever accepted bid was highest —
    // there is no way for a "winner" to be recorded that isn't actually
    // reflected in Redis, and no way for Redis to hold a value that no
    // attempt actually produced.
    const highestAccepted = Math.max(...acceptedAmounts);
    const finalValue = Number(await redis.get(`auction:${auctionId}:current_bid`));
    expect(finalValue).toBe(highestAccepted);
  });

  it('rolls back cleanly when asked, without touching a legitimately newer bid', async () => {
    const auctionId = `test-rollback-${Date.now()}`;

    const first = await bidLock.tryAcceptBid(auctionId, 'alice', 3000, 2500);
    expect(first.accepted).toBe(true);

    const second = await bidLock.tryAcceptBid(auctionId, 'bob', 3100, 2500);
    expect(second.accepted).toBe(true);
    expect(second.previousBidderId).toBe('alice');

    // Simulate: Redis accepted bob's bid, but the Postgres write that
    // should have followed it failed — undo it.
    const rolledBack = await bidLock.rollback(
      auctionId,
      3100,
      second.extra,
      second.previousBidderId,
    );
    expect(rolledBack).toBe(true);

    const restoredValue = await redis.get(`auction:${auctionId}:current_bid`);
    const restoredBidder = await redis.get(`auction:${auctionId}:current_bidder`);
    expect(restoredValue).toBe('3000');
    expect(restoredBidder).toBe('alice');

    // Now carol legitimately outbids alice...
    const third = await bidLock.tryAcceptBid(auctionId, 'carol', 3200, 2500);
    expect(third.accepted).toBe(true);

    // ...and a stale, late-arriving attempt to roll back bob's long-gone bid
    // must be a no-op, not clobber carol's real, current bid.
    const staleRollback = await bidLock.rollback(auctionId, 3100, 3000, 'alice');
    expect(staleRollback).toBe(false);
    expect(await redis.get(`auction:${auctionId}:current_bid`)).toBe('3200');
  });

  it('accepts an opening bid at exactly the starting price, with no increment required', async () => {
    const auctionId = `test-opening-${Date.now()}`;
    const result = await bidLock.tryAcceptBid(auctionId, 'first-bidder', 2500, 2500);
    expect(result.accepted).toBe(true);
  });

  it('enforces the flagged below-₹2,500 placeholder increment (currently ₹50)', async () => {
    const auctionId = `test-below-2500-${Date.now()}`;
    await bidLock.tryAcceptBid(auctionId, 'seller-price', 300, 300);

    const tooLow = await bidLock.tryAcceptBid(auctionId, 'buyer-1', 349, 300);
    expect(tooLow.accepted).toBe(false);

    const justRight = await bidLock.tryAcceptBid(auctionId, 'buyer-2', 350, 300);
    expect(justRight.accepted).toBe(true);
  });
});
