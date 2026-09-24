import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  // Frontend's ResetPasswordRequest type names this field `password`, not
  // `newPassword` — accepted as an alias rather than asking for a rename,
  // same pattern as CreateListingDto's auctionDuration/durationHours.
  @Transform(({ obj }) => obj.newPassword ?? obj.password)
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password must contain at least one letter and one number',
  })
  newPassword: string;
}
