import { IsIn, IsNumber, IsPositive, ValidateIf } from 'class-validator';
import { UppercaseInput } from '../../../common/utils/enum-case';

export class ResolveDisputeDto {
  // Frontend sends lowercase snake_case ("full_refund") — .toUpperCase()
  // maps it exactly onto these enum values with no further translation
  // needed. See common/utils/enum-case.ts.
  @UppercaseInput()
  @IsIn(['FULL_REFUND', 'PARTIAL_REFUND', 'NO_REFUND'])
  resolution: 'FULL_REFUND' | 'PARTIAL_REFUND' | 'NO_REFUND';

  // Required only for PARTIAL_REFUND — this is the admin's per-case
  // judgment call after comparing photos, not a computed value. Not
  // currently sent by the frontend's AdminDisputes form at all (its
  // ResolveDisputeRequest type has no refundAmount field yet) — flagged as
  // a frontend gap, see README.
  @ValidateIf((dto) => dto.resolution === 'PARTIAL_REFUND')
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  refundAmount?: number;
}
