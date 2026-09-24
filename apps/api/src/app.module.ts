import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import configuration from './config/configuration';

import { PrismaModule } from './database/prisma.module';
import { RedisModule } from './database/redis.module';
import { HealthModule } from './health/health.module';
import { StorageModule } from './storage/storage.module';

import { AuthModule } from './modules/auth/auth.module';
import { KycModule } from './modules/kyc/kyc.module';
import { PaymentsModule } from './modules/payments/payments.module';

// Later-phase modules — empty stubs today, real implementations arrive in
// their own build phase (see Onbid_Backend_Build_Phases.md). Imported now so
// the module graph and folder structure match the tech stack doc from
// Phase 0 onward, and so nobody has to remember to wire them in later.
import { ListingsModule } from './modules/listings/listings.module';
import { VerificationModule } from './modules/verification/verification.module';
import { AuctionsModule } from './modules/auctions/auctions.module';
import { BiddingModule } from './modules/bidding/bidding.module';
import { EscrowModule } from './modules/escrow/escrow.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    // Decouples modules that need to react to events in other modules
    // (e.g. verification module reacting to "verification fee paid" from
    // payments module) without importing each other directly — avoids the
    // circular-import problem you'd otherwise get between payments <-> the
    // domain modules that both call INTO payments (to create an order) and
    // need to be called BACK by payments (once that order is paid).
    EventEmitterModule.forRoot(),
    // Single Redis-backed BullMQ connection for the whole monolith — auction
    // auto-activate/auto-close now, escrow auto-release and notification
    // retries reuse this same connection in later phases.
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: { url: config.get<string>('redis.url', 'redis://localhost:6379') },
      }),
    }),
    PrismaModule,
    RedisModule,
    StorageModule,
    HealthModule,

    // Phase 1
    AuthModule,
    KycModule,

    // Phase 2/3
    PaymentsModule,
    ListingsModule,
    VerificationModule,
    AuctionsModule,
    BiddingModule,

    // Phase 4
    EscrowModule,

    // Phase 5
    ShippingModule,

    // Phase 6
    DisputesModule,
    AdminModule,

    // Phase 7
    NotificationsModule,
  ],
})
export class AppModule {}
