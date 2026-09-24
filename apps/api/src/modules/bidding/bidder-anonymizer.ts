import { createHash } from 'crypto';

/**
 * PRD shows anonymized bidder names in the style "B***r123". Reproducing
 * that format deterministically per (bidder, auction) pair — same bidder
 * always shows the same tag *within one auction's* history (so people can
 * recognize "that's the person I keep getting outbid by"), but a different
 * tag in a different auction (so tags can't be used to track one person
 * across auctions).
 */
export function anonymizeBidder(bidderId: string, auctionId: string): string {
  const hash = createHash('sha256').update(`${bidderId}:${auctionId}`).digest('hex');
  const num = parseInt(hash.slice(0, 6), 16) % 1000;
  return `B***r${num.toString().padStart(3, '0')}`;
}
