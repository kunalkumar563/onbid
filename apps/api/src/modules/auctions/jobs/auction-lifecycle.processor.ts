import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AUCTION_LIFECYCLE_QUEUE, AuctionsService } from '../auctions.service';

interface AuctionLifecycleJobData {
  auctionId: string;
}

@Processor(AUCTION_LIFECYCLE_QUEUE)
export class AuctionLifecycleProcessor extends WorkerHost {
  private readonly logger = new Logger(AuctionLifecycleProcessor.name);

  constructor(private readonly auctionsService: AuctionsService) {
    super();
  }

  async process(job: Job<AuctionLifecycleJobData>): Promise<void> {
    switch (job.name) {
      case 'activate':
        await this.auctionsService.activateAuction(job.data.auctionId);
        break;
      case 'close':
        await this.auctionsService.closeAuction(job.data.auctionId);
        break;
      default:
        this.logger.warn(`Unknown job name on ${AUCTION_LIFECYCLE_QUEUE}: ${job.name}`);
    }
  }
}
