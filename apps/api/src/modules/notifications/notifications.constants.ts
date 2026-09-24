export const NOTIFICATION_QUEUE = 'notifications';

/**
 * PRD §4.8's full event list. "Winning bid" (fires on every bid you place
 * that puts you in the lead) is kept distinct from "auction won" (fires
 * once, at close) — they read as different moments even though the names
 * are easy to conflate.
 */
export enum NotificationType {
  VERIFIER_ASSIGNED = 'VERIFIER_ASSIGNED',
  VERIFICATION_PASSED = 'VERIFICATION_PASSED',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  OUTBID = 'OUTBID',
  WINNING_BID = 'WINNING_BID',
  AUCTION_ENDING_SOON = 'AUCTION_ENDING_SOON',
  AUCTION_WON = 'AUCTION_WON',
  PAYMENT_REMINDER = 'PAYMENT_REMINDER',
  DELIVERY_CONFIRMATION_NEEDED = 'DELIVERY_CONFIRMATION_NEEDED',
}

export interface NotificationJobData {
  userId: string;
  type: NotificationType;
  data: Record<string, string | number>;
}
