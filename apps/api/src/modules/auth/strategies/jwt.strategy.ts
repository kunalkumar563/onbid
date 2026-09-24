import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { AccessTokenPayload, AuthenticatedUser } from '../types/authenticated-user.type';

/** Cookie fallback for the frontend's cookie-based session model — see main.ts's cookieParser() comment. Only used if no Authorization header is present. */
function fromCookieOrHeader() {
  return (req: Request): string | null => {
    const fromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (fromHeader) return fromHeader;
    return (req as any).cookies?.accessToken ?? null;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const publicKey = config.get<string>('jwt.accessPublicKey');
    if (!publicKey) {
      // Fail loudly at boot, not at the first request — a missing signing key
      // is a deploy-config bug, not a runtime edge case.
      throw new Error(
        'JWT_ACCESS_PUBLIC_KEY is not set. Run scripts/generate-jwt-keys.ts and set it in .env.',
      );
    }
    super({
      jwtFromRequest: fromCookieOrHeader(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }

  /** Whatever this returns becomes `request.user` (see CurrentUser decorator). */
  async validate(payload: AccessTokenPayload): Promise<AuthenticatedUser> {
    if (!payload.sub) throw new UnauthorizedException();
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      kycStatus: payload.kycStatus,
    };
  }
}
