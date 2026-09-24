import { Body, Controller, Delete, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PushTokenDto } from './dto/push-token.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('push-token')
  register(@CurrentUser() user: AuthenticatedUser, @Body() dto: PushTokenDto) {
    return this.notificationsService.registerPushToken(user.id, dto.token);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('push-token')
  unregister(@CurrentUser() user: AuthenticatedUser, @Body() dto: PushTokenDto) {
    return this.notificationsService.removePushToken(user.id, dto.token);
  }
}
