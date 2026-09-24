import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { R2Service } from './r2.service';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../modules/auth/types/authenticated-user.type';

@Controller('storage')
export class StorageController {
  constructor(private readonly r2Service: R2Service) {}

  /**
   * Client PUTs the raw file bytes directly to the returned `uploadUrl`
   * (Content-Type header must match what was requested here), then sends
   * `key` back when creating/updating whatever record the photo belongs to.
   */
  @UseGuards(JwtAuthGuard)
  @Post('presign-upload')
  presignUpload(@CurrentUser() user: AuthenticatedUser, @Body() dto: PresignUploadDto) {
    return this.r2Service.createPresignedUploadUrl(dto.purpose, user.id, dto.contentType);
  }
}
