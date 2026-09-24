import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NOTIFICATION_QUEUE, NotificationType } from './notifications.constants';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE) private readonly queue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Enqueues, never sends inline — a slow or failing FCM/SendGrid call
   * should never block whatever domain action triggered the notification,
   * and BullMQ gives this retry semantics for free.
   */
  async send(
    userId: string,
    type: NotificationType,
    data: Record<string, string | number>,
  ): Promise<void> {
    await this.queue.add(
      'dispatch',
      { userId, type, data },
      { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
    );
  }

  /**
   * "Ending soon" needs the auction's CURRENT bid at the moment it actually
   * fires, not whatever it was at activation time (when this gets
   * scheduled, potentially hours or days earlier) — so this only carries
   * the auctionId, and the processor does a fresh lookup + fans out to
   * every distinct bidder at process time.
   */
  async scheduleAuctionEndingSoonCheck(auctionId: string, delayMs: number): Promise<void> {
    if (delayMs <= 0) return; // duration shorter than the reminder window — nothing to schedule
    await this.queue.add(
      'auction-ending-soon-check',
      { auctionId },
      { delay: delayMs, jobId: `ending-soon:${auctionId}`, removeOnComplete: true },
    );
  }

  /** Same reasoning as above: fresh lookup at fire time, and skipped entirely if payment already happened by then. */
  async schedulePaymentReminderCheck(transactionId: string, delayMs: number): Promise<void> {
    if (delayMs <= 0) return;
    await this.queue.add(
      'payment-reminder-check',
      { transactionId },
      { delay: delayMs, jobId: `payment-reminder:${transactionId}`, removeOnComplete: true },
    );
  }

  async registerPushToken(userId: string, token: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fcmTokens: true },
    });
    if (!user || user.fcmTokens.includes(token)) return; // already registered — avoid a duplicate entry
    await this.prisma.user.update({
      where: { id: userId },
      data: { fcmTokens: { push: token } },
    });
  }

  async removePushToken(userId: string, token: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fcmTokens: true },
    });
    if (!user) return;
    await this.prisma.user.update({
      where: { id: userId },
      data: { fcmTokens: user.fcmTokens.filter((t: string) => t !== token) },
    });
  }
}
