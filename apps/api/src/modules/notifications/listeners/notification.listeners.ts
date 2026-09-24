import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';
import { NotificationType } from '../notifications.constants';
import { ConfigService } from '@nestjs/config';
import {
  AUCTION_EVENTS,
  AuctionActivatedEvent,
  AuctionEndedEvent,
} from '../../auctions/events/auction.events';
import {
  VERIFICATION_EVENTS,
  VerificationAssignedEvent,
  VerificationOutcomeEvent,
} from '../../verification/events/verification.events';
import { SHIPPING_EVENTS, PredispatchRecordedEvent } from '../../shipping/events/shipping.events';
import { ESCROW_EVENTS, TransactionCreatedEvent } from '../../escrow/events/escrow.events';
import { BIDDING_EVENTS, BidAcceptedEvent } from '../../bidding/events/bidding.events';

@Injectable()
export class NotificationListeners {
  private readonly endingSoonLeadMs: number;
  private readonly paymentReminderLeadMs: number;

  constructor(
    private readonly notificationsService: NotificationsService,
    config: ConfigService,
  ) {
    this.endingSoonLeadMs =
      config.get<number>('notifications.auctionEndingSoonMinutes', 15) * 60 * 1000;
    this.paymentReminderLeadMs =
      config.get<number>('notifications.paymentReminderHoursBefore', 12) * 60 * 60 * 1000;
  }

  @OnEvent(VERIFICATION_EVENTS.ASSIGNED)
  async onVerifierAssigned(event: VerificationAssignedEvent): Promise<void> {
    await this.notificationsService.send(event.sellerId, NotificationType.VERIFIER_ASSIGNED, {
      listingTitle: event.listingTitle,
    });
  }

  @OnEvent(VERIFICATION_EVENTS.PASSED)
  async onVerificationPassed(event: VerificationOutcomeEvent): Promise<void> {
    await this.notificationsService.send(event.sellerId, NotificationType.VERIFICATION_PASSED, {
      listingTitle: event.listingTitle,
    });
  }

  @OnEvent(VERIFICATION_EVENTS.FAILED)
  async onVerificationFailed(event: VerificationOutcomeEvent): Promise<void> {
    await this.notificationsService.send(event.sellerId, NotificationType.VERIFICATION_FAILED, {
      listingTitle: event.listingTitle,
      notes: event.notes ?? '',
    });
  }

  @OnEvent(AUCTION_EVENTS.ACTIVATED)
  async onAuctionActivated(event: AuctionActivatedEvent): Promise<void> {
    const delay = event.endTime.getTime() - Date.now() - this.endingSoonLeadMs;
    await this.notificationsService.scheduleAuctionEndingSoonCheck(event.auctionId, delay);
  }

  @OnEvent(AUCTION_EVENTS.ENDED)
  async onAuctionEnded(event: AuctionEndedEvent): Promise<void> {
    if (!event.winningBidderId || event.winningBid === null) return; // no bids — nobody to notify as a winner
    await this.notificationsService.send(event.winningBidderId, NotificationType.AUCTION_WON, {
      listingTitle: event.listingTitle,
      amount: event.winningBid,
    });
  }

  @OnEvent(BIDDING_EVENTS.BID_ACCEPTED)
  async onBidAccepted(event: BidAcceptedEvent): Promise<void> {
    if (event.previousBidderId && event.previousBidAmount !== null) {
      await this.notificationsService.send(event.previousBidderId, NotificationType.OUTBID, {
        listingTitle: event.listingTitle,
        newBid: event.amount,
        yourBid: event.previousBidAmount,
      });
    }
    await this.notificationsService.send(event.bidderId, NotificationType.WINNING_BID, {
      listingTitle: event.listingTitle,
      amount: event.amount,
    });
  }

  @OnEvent(ESCROW_EVENTS.TRANSACTION_CREATED)
  async onTransactionCreated(event: TransactionCreatedEvent): Promise<void> {
    const delay = event.paymentDeadline.getTime() - Date.now() - this.paymentReminderLeadMs;
    await this.notificationsService.schedulePaymentReminderCheck(event.transactionId, delay);
  }

  @OnEvent(SHIPPING_EVENTS.PREDISPATCH_RECORDED)
  async onPredispatchRecorded(event: PredispatchRecordedEvent): Promise<void> {
    await this.notificationsService.send(
      event.buyerId,
      NotificationType.DELIVERY_CONFIRMATION_NEEDED,
      {
        listingTitle: event.listingTitle,
        courierName: event.courierName,
        trackingNumber: event.trackingNumber,
      },
    );
  }
}
