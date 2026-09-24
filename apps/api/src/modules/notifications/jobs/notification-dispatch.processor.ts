import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { PushService } from '../push.service';
import { EmailService } from '../email.service';
import { NotificationsService } from '../notifications.service';
import { renderNotification } from '../templates/notification-templates';
import {
  NOTIFICATION_QUEUE,
  NotificationJobData,
  NotificationType,
} from '../notifications.constants';

@Processor(NOTIFICATION_QUEUE)
export class NotificationDispatchProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationDispatchProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pushService: PushService,
    private readonly emailService: EmailService,
    private readonly notificationsService: NotificationsService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'dispatch':
        return this.dispatch(job.data as NotificationJobData);
      case 'auction-ending-soon-check':
        return this.checkAuctionEndingSoon(job.data.auctionId);
      case 'payment-reminder-check':
        return this.checkPaymentReminder(job.data.transactionId);
      default:
        this.logger.warn(`Unknown job name on ${NOTIFICATION_QUEUE}: ${job.name}`);
    }
  }

  private async dispatch({ userId, type, data }: NotificationJobData): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fcmTokens: true },
    });
    if (!user) {
      this.logger.warn(`Notification ${type} for unknown user ${userId} — dropped`);
      return;
    }

    const content = renderNotification(type, data);

    const [pushResult, emailResult] = await Promise.allSettled([
      this.pushService.sendToTokens(user.fcmTokens, content.pushTitle, content.pushBody),
      this.emailService.send(user.email, content.emailSubject, content.emailBody),
    ]);

    // This log line is the "prove it" mechanism Phase 7's done-when asks
    // for: every dispatch attempt is traceable — who, what type, and
    // whether push/email actually succeeded — without needing to guess.
    this.logger.log(
      `Notification ${type} -> user ${userId}: ` +
        `push=${pushResult.status === 'fulfilled' ? `${pushResult.value.successCount} sent` : 'FAILED'}, ` +
        `email=${emailResult.status === 'fulfilled' ? 'sent' : 'FAILED'}`,
    );

    if (pushResult.status === 'rejected') {
      this.logger.error(
        `Push send failed for ${type}/${userId}`,
        (pushResult.reason as Error)?.stack,
      );
    } else if (pushResult.value.invalidTokens.length > 0) {
      for (const token of pushResult.value.invalidTokens) {
        await this.notificationsService.removePushToken(userId, token);
      }
    }
    if (emailResult.status === 'rejected') {
      this.logger.error(
        `Email send failed for ${type}/${userId}`,
        (emailResult.reason as Error)?.stack,
      );
      throw emailResult.reason; // let BullMQ's retry/backoff handle transient email failures
    }
  }

  /** Fresh lookup by design — see NotificationsService.scheduleAuctionEndingSoonCheck. */
  private async checkAuctionEndingSoon(auctionId: string): Promise<void> {
    const auction = await this.prisma.auction.findUnique({ where: { id: auctionId } });
    if (!auction || auction.status !== 'ACTIVE') return; // already ended/cancelled — nothing to remind about

    const minutesRemaining = auction.endTime
      ? Math.max(0, Math.round((auction.endTime.getTime() - Date.now()) / 60000))
      : 0;

    const bidders = await this.prisma.bid.findMany({
      where: { auctionId },
      distinct: ['bidderId'],
      select: { bidderId: true },
    });

    for (const { bidderId } of bidders as { bidderId: string }[]) {
      await this.notificationsService.send(bidderId, NotificationType.AUCTION_ENDING_SOON, {
        listingTitle: auction.title,
        minutesRemaining,
        currentBid: auction.currentBid ? Number(auction.currentBid) : 0,
      });
    }
  }

  /** Fresh lookup by design — skipped entirely if payment already happened before this fires. */
  private async checkPaymentReminder(transactionId: string): Promise<void> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { auction: { select: { title: true } } },
    });
    if (!transaction || transaction.status !== 'AWAITING_PAYMENT') return;

    const hoursRemaining = Math.max(
      0,
      Math.round((transaction.paymentDeadline.getTime() - Date.now()) / (60 * 60 * 1000)),
    );

    await this.notificationsService.send(transaction.buyerId, NotificationType.PAYMENT_REMINDER, {
      listingTitle: transaction.auction.title,
      hoursRemaining,
      amount: Number(transaction.amount),
    });
  }
}
