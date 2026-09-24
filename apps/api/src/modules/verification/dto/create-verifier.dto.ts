import { IsString, MinLength } from 'class-validator';

export class CreateVerifierDto {
  @IsString()
  userId: string;

  @IsString()
  @MinLength(2)
  coverageArea: string;
}
