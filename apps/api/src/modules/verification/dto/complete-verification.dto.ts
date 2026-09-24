import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { MAX_VERIFICATION_PHOTOS, MIN_VERIFICATION_PHOTOS } from '../verification-checklists';
import { UppercaseInput } from '../../../common/utils/enum-case';

export class CompleteVerificationDto {
  // Frontend sends lowercase ("passed"/"failed") — see common/utils/enum-case.ts.
  @UppercaseInput()
  @IsIn(['PASSED', 'FAILED'])
  verdict: 'PASSED' | 'FAILED';

  // { [checklistItemId]: boolean } — validated against the category's
  // template in the service, where we actually know the auction's category.
  @IsObject()
  checklist: Record<string, boolean>;

  @IsArray()
  @ArrayMinSize(MIN_VERIFICATION_PHOTOS)
  @ArrayMaxSize(MAX_VERIFICATION_PHOTOS)
  @IsString({ each: true })
  photos: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
