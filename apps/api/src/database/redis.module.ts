import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

/**
 * Single shared ioredis connection for the whole monolith (per tech stack §8 —
 * one Redis instance is plenty at campus scale). Used for: refresh-token storage
 * (auth), and later the bid compare-and-set Lua script + Redis Streams (bidding),
 * and BullMQ (notifications, auto-close, auto-release jobs).
 */
@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('redis.url', 'redis://localhost:6379');
        return new Redis(url, {
          maxRetriesPerRequest: 3,
          lazyConnect: false,
        });
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
