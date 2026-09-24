import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateDisputeDto {
  @IsUUID()
  transactionId: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  reason: string;
}
