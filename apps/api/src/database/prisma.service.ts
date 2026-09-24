import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Thin wrapper so the rest of the app injects PrismaService instead of importing
 * @prisma/client directly — makes it swappable/mockable in tests, and gives us one
 * place to hook query logging or middleware later.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? [{ emit: 'event', level: 'query' }, 'warn', 'error']
          : ['warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to Postgres via Prisma');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
