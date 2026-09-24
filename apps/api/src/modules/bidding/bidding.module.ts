import { Module } from '@nestjs/common';
import { BiddingController } from './bidding.controller';
import { BiddingGateway } from './bidding.gateway';
import { BiddingService } from './bidding.service';
import { BidLockService } from './bid-lock.service';
import { BidStreamService } from './bid-stream.service';
import { AuctionsModule } from '../auctions/auctions.module';
import { PaymentsModule } from '../payments/payments.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuctionsModule, PaymentsModule, AuthModule],
  controllers: [BiddingController],
  providers: [BiddingGateway, BiddingService, BidLockService, BidStreamService],
})
export class BiddingModule {}
