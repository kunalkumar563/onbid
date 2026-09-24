import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash } from 'crypto';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../database/redis.module';

/**
 * Refresh tokens live only in Redis (tech stack §4: "stored in Redis so you
 * can revoke on logout/suspicious activity") — they are never persisted to
 * Postgres. Each token is opaque (not a JWT); we store a hash of it, not the
 * raw value, so a Redis dump alone can't be replayed as valid tokens.
 *
 * Key layout:
 *   refresh:{tokenHash}        -> userId          (TTL = refreshTtlDays)
 *   refresh_index:{userId}     -> Set<tokenHash>   (no TTL; cleaned up as tokens expire/rotate)
 *
 * The index lets us support "logout everywhere" / revoke-on-suspicious-activity
 * later without scanning all of Redis.
 */
@Injectable()
export class RefreshTokenStore {
  private readonly ttlSeconds: number;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly config: ConfigService,
  ) {
    this.ttlSeconds = this.config.get<number>('jwt.refreshTtlDays', 30) * 24 * 60 * 60;
  }

  private hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /** Issues a new opaque refresh token for a user and stores it. */
  async issue(userId: string): Promise<string> {
    const token = randomBytes(64).toString('hex');
    const tokenHash = this.hash(token);

    await this.redis
      .multi()
      .set(`refresh:${tokenHash}`, userId, 'EX', this.ttlSeconds)
      .sadd(`refresh_index:${userId}`, tokenHash)
      .exec();

    return token;
  }

  /** Returns the owning userId if the token is valid, else null. */
  async verify(token: string): Promise<string | null> {
    return this.redis.get(`refresh:${this.hash(token)}`);
  }

  /** Rotation: the old token is invalidated as part of issuing the replacement. */
  async rotate(oldToken: string, userId: string): Promise<string> {
    await this.revoke(oldToken, userId);
    return this.issue(userId);
  }

  async revoke(token: string, userId: string): Promise<void> {
    const tokenHash = this.hash(token);
    await this.redis
      .multi()
      .del(`refresh:${tokenHash}`)
      .srem(`refresh_index:${userId}`, tokenHash)
      .exec();
  }

  /** Kills every session for a user — for future admin/security use (suspicious activity, password change, etc). */
  async revokeAllForUser(userId: string): Promise<void> {
    const hashes = await this.redis.smembers(`refresh_index:${userId}`);
    if (hashes.length === 0) return;
    const pipeline = this.redis.multi();
    for (const h of hashes) pipeline.del(`refresh:${h}`);
    pipeline.del(`refresh_index:${userId}`);
    await pipeline.exec();
  }
}
