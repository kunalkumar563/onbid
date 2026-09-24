import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { AuctionCategory } from '@prisma/client';
import { UppercaseInput } from '../../../common/utils/enum-case';

export class ListActiveQueryDto {
  @IsOptional()
  @UppercaseInput()
  @IsEnum(AuctionCategory)
  category?: AuctionCategory;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
