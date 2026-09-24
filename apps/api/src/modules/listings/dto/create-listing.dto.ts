import { AuctionCategory } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  MAX_DURATION_HOURS,
  MAX_PHOTOS,
  MIN_DURATION_HOURS,
  MIN_PHOTOS,
} from '../listings.constants';
import { UppercaseInput } from '../../../common/utils/enum-case';

export class CreateListingDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  // Frontend sends lowercase snake_case ("jewelry_watches"); Prisma's
  // enum convention is uppercase — see common/utils/enum-case.ts.
  @UppercaseInput()
  @IsEnum(AuctionCategory)
  category: AuctionCategory;

  // Validated against category-taxonomy.ts in the service (needs the
  // category value to know which subtree applies) — stored as plain
  // strings, not enums, matching the frontend's own values exactly with no
  // case transform (they're already the frontend's real values). Required,
  // not optional — the frontend's own ListingCategorySelection type treats
  // all three levels as collected together, never partially.
  @IsString()
  @MinLength(1)
  subCategory: string;

  @IsString()
  @MinLength(1)
  subSubCategory: string;

  // Category-specific minimum is checked in the service (needs the category
  // value to know which floor applies) — this decorator just rules out
  // nonsense like 0 or negative prices.
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  startingPrice: number;

  // The frontend's field is named `auctionDuration`, not `durationHours` —
  // accepted as an alias here rather than asking the frontend to rename a
  // field across its forms/types for a naming preference alone.
  @Transform(({ obj }) => obj.durationHours ?? obj.auctionDuration)
  @IsInt()
  @Min(MIN_DURATION_HOURS)
  @Max(MAX_DURATION_HOURS)
  durationHours: number;

  @IsArray()
  @ArrayMinSize(MIN_PHOTOS)
  @ArrayMaxSize(MAX_PHOTOS)
  @IsString({ each: true })
  photos: string[]; // R2 object keys returned by POST /api/storage/presign-upload

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  sellerLocation: string;

  // Optional per PRD §4.2 vs §4.3 reconciliation — see schema.prisma comment.
  // If omitted, the listing publishes immediately once verification passes.
  @IsOptional()
  @IsDateString()
  requestedStartTime?: string;
}
