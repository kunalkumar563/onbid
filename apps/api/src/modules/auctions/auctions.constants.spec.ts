import { getMinimumIncrement, getMinimumNextBid, BELOW_2500_INCREMENT } from './auctions.constants';

describe('getMinimumIncrement (PRD §4.4 tier table)', () => {
  it.each([
    [2500, 100],
    [4999, 100],
    [5000, 250],
    [9999, 250],
    [10000, 500],
    [24999, 500],
    [25000, 1000],
    [100000, 1000],
  ])('currentBid=%i -> increment=%i', (currentBid, expected) => {
    expect(getMinimumIncrement(currentBid)).toBe(expected);
  });

  it('falls back to the flagged placeholder below ₹2,500', () => {
    expect(getMinimumIncrement(300)).toBe(BELOW_2500_INCREMENT);
    expect(getMinimumIncrement(2499)).toBe(BELOW_2500_INCREMENT);
  });
});

describe('getMinimumNextBid', () => {
  it('requires only the starting price when there is no bid yet', () => {
    expect(getMinimumNextBid(null, 300)).toBe(300);
    expect(getMinimumNextBid(null, 2500)).toBe(2500);
  });

  it('requires currentBid + tier increment once a bid exists', () => {
    expect(getMinimumNextBid(2500, 2500)).toBe(2600); // +100 tier
    expect(getMinimumNextBid(5000, 2500)).toBe(5250); // +250 tier
    expect(getMinimumNextBid(30000, 2500)).toBe(31000); // +1000 tier
  });
});
