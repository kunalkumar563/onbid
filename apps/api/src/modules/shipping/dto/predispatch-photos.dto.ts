import { ArrayMaxSize, ArrayMinSize, IsArray, IsString, MinLength } from 'class-validator';

// PRD §4.6 doesn't give an explicit photo-count range for shipping proof
// (unlike listings' 1-10 or verification's 5-10) — 1-10 here is a
// reasonable inferred default matching the pattern used elsewhere, not a
// documented requirement.
export class PredispatchPhotosDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  photos: string[];

  @IsString()
  @MinLength(2)
  courierName: string;

  @IsString()
  @MinLength(2)
  trackingNumber: string;
}
