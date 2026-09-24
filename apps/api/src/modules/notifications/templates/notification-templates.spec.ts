import { NotificationType } from '../notifications.constants';
import { renderNotification } from './notification-templates';

describe('renderNotification', () => {
  const sampleData: Record<NotificationType, Record<string, string | number>> = {
    [NotificationType.VERIFIER_ASSIGNED]: { listingTitle: 'Study Lamp' },
    [NotificationType.VERIFICATION_PASSED]: { listingTitle: 'Study Lamp' },
    [NotificationType.VERIFICATION_FAILED]: { listingTitle: 'Study Lamp', notes: 'photos unclear' },
    [NotificationType.OUTBID]: { listingTitle: 'Study Lamp', newBid: 500, yourBid: 400 },
    [NotificationType.WINNING_BID]: { listingTitle: 'Study Lamp', amount: 500 },
    [NotificationType.AUCTION_ENDING_SOON]: {
      listingTitle: 'Study Lamp',
      minutesRemaining: 15,
      currentBid: 500,
    },
    [NotificationType.AUCTION_WON]: { listingTitle: 'Study Lamp', amount: 500 },
    [NotificationType.PAYMENT_REMINDER]: {
      listingTitle: 'Study Lamp',
      hoursRemaining: 12,
      amount: 500,
    },
    [NotificationType.DELIVERY_CONFIRMATION_NEEDED]: {
      listingTitle: 'Study Lamp',
      trackingNumber: 'TRK123',
      courierName: 'Delhivery',
    },
  };

  it.each(Object.values(NotificationType))(
    'renders every field for %s without throwing',
    (type) => {
      const result = renderNotification(type, sampleData[type]);
      expect(result.pushTitle.length).toBeGreaterThan(0);
      expect(result.pushBody.length).toBeGreaterThan(0);
      expect(result.emailSubject.length).toBeGreaterThan(0);
      expect(result.emailBody.length).toBeGreaterThan(0);
      // Every template interpolates at least the listing title — a template
      // that silently drops its data (renders "undefined") is worse than one
      // that throws, since it fails quietly in production.
      expect(result.pushBody).not.toContain('undefined');
      expect(result.emailBody).not.toContain('undefined');
    },
  );

  it('covers every NotificationType — fails loudly if a new type is added without a template', () => {
    const typeCount = Object.values(NotificationType).length;
    expect(Object.keys(sampleData).length).toBe(typeCount);
  });
});
