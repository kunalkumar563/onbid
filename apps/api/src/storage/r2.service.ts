import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const PRESIGNED_URL_TTL_SECONDS = 5 * 60;

/**
 * R2 is S3-compatible (tech stack §1), so the standard AWS S3 SDK works
 * against it unmodified — just point `endpoint` at R2's per-account URL and
 * use R2's access key pair instead of AWS's.
 *
 * Uploads go client -> R2 directly via a presigned PUT URL, not client ->
 * our server -> R2. That keeps multi-MB photo uploads (up to 10 per listing,
 * 5-10 per verification) off our Node process entirely.
 */
@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl?: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('r2.bucket', 'onbid-media');
    this.publicBaseUrl = this.config.get<string>('r2.publicBaseUrl');

    const endpoint = this.config.get<string>('r2.endpoint');
    const accessKeyId = this.config.get<string>('r2.accessKeyId');
    const secretAccessKey = this.config.get<string>('r2.secretAccessKey');

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      this.logger.warn(
        'R2_ENDPOINT / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY are not fully set — ' +
          'presigned upload URLs will fail until configured',
      );
    }

    this.client = new S3Client({
      region: 'auto', // R2 ignores region but the SDK requires the field
      endpoint,
      credentials: { accessKeyId: accessKeyId ?? '', secretAccessKey: secretAccessKey ?? '' },
    });
  }

  /**
   * `purpose` namespaces the key (e.g. "listings", "verification",
   * "delivery-proofs") so objects are organized and one purpose's uploads
   * can't collide with another's. Returns the key the caller must send back
   * when creating/updating the record the photo belongs to.
   */
  async createPresignedUploadUrl(
    purpose: string,
    userId: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const extension = this.extensionFor(contentType);
    const key = `${purpose}/${userId}/${randomUUID()}${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: PRESIGNED_URL_TTL_SECONDS,
    });

    return { uploadUrl, key, publicUrl: this.getPublicUrl(key) };
  }

  getPublicUrl(key: string): string {
    if (this.publicBaseUrl) return `${this.publicBaseUrl.replace(/\/$/, '')}/${key}`;
    // Fallback: R2's own S3-style URL (works if the bucket has public access configured)
    return `${this.config.get<string>('r2.endpoint', '')}/${this.bucket}/${key}`;
  }

  private extensionFor(contentType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };
    return map[contentType] ?? '';
  }
}
