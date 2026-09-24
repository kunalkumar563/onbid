import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  // PRD doesn't specify a password policy beyond "email/password registration" —
  // this is a reasonable minimum bar (length + at least one letter and one digit),
  // not a compliance requirement. Tighten if the team wants something stricter.
  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt silently truncates beyond 72 bytes — cap it explicitly instead
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password must contain at least one letter and one number',
  })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  // ISO date string, e.g. "2005-03-14" — used to enforce the minimum-age-18 rule.
  @IsDateString()
  dateOfBirth: string;

  // Not in the original PRD spec, but the frontend's signup form collects
  // it — optional here so other API consumers aren't forced to provide it.
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
