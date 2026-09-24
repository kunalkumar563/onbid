import { NotificationType } from '../notifications.constants';

export interface RenderedNotification {
  pushTitle: string;
  pushBody: string;
  emailSubject: string;
  emailBody: string;
}

type TemplateFn = (data: Record<string, string | number>) => RenderedNotification;

const templates: Record<NotificationType, TemplateFn> = {
  [NotificationType.VERIFIER_ASSIGNED]: (d) => ({
    pushTitle: 'Verifier assigned',
    pushBody: `A verifier will visit you to inspect "${d.listingTitle}".`,
    emailSubject: `Your listing "${d.listingTitle}" has a verifier assigned`,
    emailBody: `A verifier has been assigned to inspect "${d.listingTitle}". They'll be in touch to schedule a visit.`,
  }),
  [NotificationType.VERIFICATION_PASSED]: (d) => ({
    pushTitle: 'Verification passed',
    pushBody: `"${d.listingTitle}" passed verification and is going live.`,
    emailSubject: `"${d.listingTitle}" passed verification`,
    emailBody: `Good news — "${d.listingTitle}" passed verification and will publish as an auction shortly.`,
  }),
  [NotificationType.VERIFICATION_FAILED]: (d) => ({
    pushTitle: 'Verification did not pass',
    pushBody: `"${d.listingTitle}" did not pass verification.`,
    emailSubject: `"${d.listingTitle}" did not pass verification`,
    emailBody: `Unfortunately "${d.listingTitle}" did not pass verification${d.notes ? `: ${d.notes}` : '.'} You can review the details and resubmit.`,
  }),
  [NotificationType.OUTBID]: (d) => ({
    pushTitle: "You've been outbid",
    pushBody: `Someone bid ₹${d.newBid} on "${d.listingTitle}" — you were at ₹${d.yourBid}.`,
    emailSubject: `You've been outbid on "${d.listingTitle}"`,
    emailBody: `Another bidder placed ₹${d.newBid} on "${d.listingTitle}", passing your bid of ₹${d.yourBid}. Place a new bid before it ends.`,
  }),
  [NotificationType.WINNING_BID]: (d) => ({
    pushTitle: "You're in the lead",
    pushBody: `Your bid of ₹${d.amount} on "${d.listingTitle}" is currently winning.`,
    emailSubject: `You're winning "${d.listingTitle}"`,
    emailBody: `Your bid of ₹${d.amount} on "${d.listingTitle}" is currently the highest.`,
  }),
  [NotificationType.AUCTION_ENDING_SOON]: (d) => ({
    pushTitle: 'Auction ending soon',
    pushBody: `"${d.listingTitle}" ends in ${d.minutesRemaining} minutes.`,
    emailSubject: `"${d.listingTitle}" ends soon`,
    emailBody: `"${d.listingTitle}" ends in ${d.minutesRemaining} minutes — the current bid is ₹${d.currentBid}.`,
  }),
  [NotificationType.AUCTION_WON]: (d) => ({
    pushTitle: 'You won!',
    pushBody: `You won "${d.listingTitle}" for ₹${d.amount}. Complete payment within 48 hours.`,
    emailSubject: `You won "${d.listingTitle}"`,
    emailBody: `Congratulations — you won "${d.listingTitle}" with a bid of ₹${d.amount}. Complete payment within 48 hours or the item will be offered to the next bidder.`,
  }),
  [NotificationType.PAYMENT_REMINDER]: (d) => ({
    pushTitle: 'Payment reminder',
    pushBody: `${d.hoursRemaining}h left to pay for "${d.listingTitle}".`,
    emailSubject: `Reminder: complete payment for "${d.listingTitle}"`,
    emailBody: `You have ${d.hoursRemaining} hours left to complete payment for "${d.listingTitle}" (₹${d.amount}) before it's offered to the next bidder.`,
  }),
  [NotificationType.DELIVERY_CONFIRMATION_NEEDED]: (d) => ({
    pushTitle: 'Confirm delivery',
    pushBody: `Has "${d.listingTitle}" arrived? Confirm delivery to complete the purchase.`,
    emailSubject: `Confirm delivery of "${d.listingTitle}"`,
    emailBody: `The seller has shipped "${d.listingTitle}" (tracking: ${d.trackingNumber}, ${d.courierName}). Once it arrives, confirm delivery in the app.`,
  }),
};

export function renderNotification(
  type: NotificationType,
  data: Record<string, string | number>,
): RenderedNotification {
  return templates[type](data);
}
