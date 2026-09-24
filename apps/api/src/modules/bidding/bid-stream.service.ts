import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../database/redis.module';
import { bidKeys, EVENT_STREAM_MAXLEN } from './bidding.constants';

export interface BidStreamEvent {
  bidId: string;
  amount: string;
  bidderTag: string; // anonymized display tag, never the raw user id
  createdAt: string;
  endTime: string;
  extensionsUsed: string;
}

export interface StreamEntry {
  streamId: string;
  event: BidStreamEvent;
}

/**
 * Pub/Sub alone can't help a client that was disconnected when a bid
 * happened — by the time they reconnect, that message is gone forever.
 * A Stream keeps a short, capped history that a reconnecting client can
 * read forward from their last-seen entry id, then switch back to live
 * Socket.io room events once caught up.
 */
@Injectable()
export class BidStreamService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async append(auctionId: string, event: BidStreamEvent): Promise<string> {
    return this.redis.xadd(
      bidKeys.eventStream(auctionId),
      'MAXLEN',
      '~',
      EVENT_STREAM_MAXLEN,
      '*',
      'bidId',
      event.bidId,
      'amount',
      event.amount,
      'bidderTag',
      event.bidderTag,
      'createdAt',
      event.createdAt,
      'endTime',
      event.endTime,
      'extensionsUsed',
      event.extensionsUsed,
    ) as Promise<string>;
  }

  /** `afterId` is exclusive — pass the last stream id the client already has. */
  async getEventsSince(auctionId: string, afterId: string): Promise<StreamEntry[]> {
    const raw = await this.redis.xrange(bidKeys.eventStream(auctionId), `(${afterId}`, '+');
    return raw.map(([streamId, fields]) => ({
      streamId,
      event: this.fieldsToEvent(fields),
    }));
  }

  private fieldsToEvent(fields: string[]): BidStreamEvent {
    const obj: Record<string, string> = {};
    for (let i = 0; i < fields.length; i += 2) {
      obj[fields[i]] = fields[i + 1];
    }
    return obj as unknown as BidStreamEvent;
  }
}
