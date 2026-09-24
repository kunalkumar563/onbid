import { IsInt, IsPositive } from 'class-validator';

export class PlaceBidDto {
  // Whole rupees only — the PRD's increment tiers are all whole numbers and
  // Redis-side arithmetic in the Lua script assumes integers, not Decimal.
  @IsInt()
  @IsPositive()
  amount: number;
}
