import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  HealthIndicatorFunction,
} from '@nestjs/terminus';
import { PrismaService } from '../database/prisma.service';
import { REDIS_CLIENT } from '../database/redis.module';
import Redis from 'ioredis';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  /**
   * Phase 0's "done when": this must return 200 on a real deployed URL.
   * It genuinely checks Postgres + Redis rather than just "the process is running" —
   * a health check that can't fail isn't proving anything.
   */
  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    const checks: HealthIndicatorFunction[] = [
      async () => {
        await this.prisma.$queryRaw`SELECT 1`;
        return { postgres: { status: 'up' } };
      },
      async () => {
        const pong = await this.redis.ping();
        return { redis: { status: pong === 'PONG' ? 'up' : 'down' } };
      },
    ];
    return this.health.check(checks);
  }
}
