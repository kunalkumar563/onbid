import { IsIn, IsString, Matches } from 'class-validator';

export class InitiateKycDto {
  @IsIn(['pan', 'aadhaar'])
  documentType: 'pan' | 'aadhaar';

  // Loose format validation only — the provider does the actual verification.
  // PAN: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F). Aadhaar: 12 digits.
  @IsString()
  @Matches(/^([A-Z]{5}[0-9]{4}[A-Z]|[0-9]{12})$/, {
    message: 'documentNumber must be a valid PAN (ABCDE1234F) or 12-digit Aadhaar number',
  })
  documentNumber: string;
}
