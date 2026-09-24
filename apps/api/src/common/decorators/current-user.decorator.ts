import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUser } from '../../modules/auth/types/authenticated-user.type';

/**
 * Usage: findMe(@CurrentUser() user: AuthenticatedUser)
 * Relies on JwtAuthGuard having already attached `user` to the request (see
 * JwtStrategy.validate).
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
