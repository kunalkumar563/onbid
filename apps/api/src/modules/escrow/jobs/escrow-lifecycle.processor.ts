import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ESCROW_LIFECYCLE_QUEUE } from '../escrow.constants';
import { EscrowService } from '../escrow.service';

interface EscrowJobData {
  transactionId: string;
}

@Processor(ESCROW_LIFECYCLE_QUEUE)
export class EscrowLifecycleProcessor extends WorkerHost {
  private readonly logger = new Logger(EscrowLifecycleProcessor.name);

  constructor(private readonly escrowService: EscrowService) {
    super();
  }

  async process(job: Job<EscrowJobData>): Promise<void> {
    switch (job.name) {
      case 'payment-deadline':
        await this.escrowService.handlePaymentDeadline(job.data.transactionId);
        break;
      case 'auto-release':
        // Reuses the same release() path a manual admin action would use —
        // one release implementation, two triggers.
        await this.escrowService.release(job.data.transactionId).catch((err) => {
          // A transaction that was disputed/withdrawn between delivery and
          // the 3-day mark will legitimately fail this (status no longer
          // DELIVERED) — that's expected, not an error worth crashing the
          // worker over.
          this.logger.debug(
            `Auto-release skipped for ${job.data.transactionId}: ${(err as Error).message}`,
          );
        });
        break;
      default:
        this.logger.warn(`Unknown job name on ${ESCROW_LIFECYCLE_QUEUE}: ${job.name}`);
    }
  }
}
