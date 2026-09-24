import { computePayout } from './escrow-math';

describe('computePayout (PRD §4.5 + build-phases 7% commission)', () => {
  it('deducts a flat 7% commission plus the actual reported gateway fee/tax', () => {
    // amount=10000, commission=700 (7%), gatewayFee=200, gatewayTax=36
    const result = computePayout(10000, 200, 36);
    expect(result.commissionAmount).toBe(700);
    expect(result.payoutAmount).toBe(10000 - 700 - 200 - 36);
  });

  it('rounds to 2 decimal places rather than accumulating float drift', () => {
    const result = computePayout(2599, 12.345, 2.22);
    // 2599 * 0.07 = 181.93 exactly, but this exercises the rounding path either way
    expect(result.commissionAmount).toBe(Math.round(2599 * 0.07 * 100) / 100);
    expect(Number.isFinite(result.payoutAmount)).toBe(true);
    // No more than 2 decimal places in the output
    expect(result.payoutAmount).toBe(Math.round(result.payoutAmount * 100) / 100);
  });

  it('never assumes a gateway fee — zero fee/tax input means only commission is deducted', () => {
    const result = computePayout(5000, 0, 0);
    expect(result.commissionAmount).toBe(350);
    expect(result.payoutAmount).toBe(4650);
  });

  it('handles the below-₹2,500 category floor amounts correctly too', () => {
    const result = computePayout(300, 5, 1);
    expect(result.commissionAmount).toBe(21); // 300 * 0.07
    expect(result.payoutAmount).toBe(300 - 21 - 5 - 1);
  });
});
