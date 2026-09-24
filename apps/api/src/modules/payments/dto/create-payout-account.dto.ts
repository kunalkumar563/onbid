import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreatePayoutAccountDto {
  @IsString()
  @MinLength(2)
  beneficiaryName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  @Matches(/^\d{9,18}$/, { message: 'bankAccountNumber must be 9-18 digits' })
  bankAccountNumber: string;

  @IsString()
  @Matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: 'bankIfsc must be a valid IFSC code' })
  bankIfsc: string;
}
