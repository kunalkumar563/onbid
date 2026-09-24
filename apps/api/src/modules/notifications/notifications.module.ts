import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PushService } from './push.service';
import { EmailService } from './email.service';
import { NotificationDispatchProcessor } from './jobs/notification-dispatch.processor';
import { NOTIFICATION_QUEUE } from './notifications.constants';
import { NotificationListeners } from './listeners/notification.listeners';

@Module({
  imports: [BullModule.registerQueue({ name: NOTIFICATION_QUEUE })],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    PushService,
    EmailService,
    NotificationDispatchProcessor,
    NotificationListeners,
  ],
  exports: [NotificationsService, EmailService],
})
export class NotificationsModule {}
