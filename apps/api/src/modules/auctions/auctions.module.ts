import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuctionsService, AUCTION_LIFECYCLE_QUEUE } from './auctions.service';
import { AuctionLifecycleProcessor } from './jobs/auction-lifecycle.processor';

@Module({
  imports: [BullModule.registerQueue({ name: AUCTION_LIFECYCLE_QUEUE })],
  providers: [AuctionsService, AuctionLifecycleProcessor],
  // Exported for VerificationModule (verification outcome -> lifecycle
  // transition) and BiddingModule (recording accepted bids).
  exports: [AuctionsService],
})
export class AuctionsModule {}
