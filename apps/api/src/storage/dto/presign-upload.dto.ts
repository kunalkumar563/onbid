import { IsIn } from 'class-validator';

// Whitelisted purposes only — an arbitrary client-supplied prefix could be
// used to scatter uploads anywhere in the bucket.
const ALLOWED_PURPOSES = ['listings', 'verification', 'delivery-proofs'] as const;
export type UploadPurpose = (typeof ALLOWED_PURPOSES)[number];

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export class PresignUploadDto {
  @IsIn(ALLOWED_PURPOSES)
  purpose: UploadPurpose;

  @IsIn(ALLOWED_CONTENT_TYPES)
  contentType: (typeof ALLOWED_CONTENT_TYPES)[number];
}
