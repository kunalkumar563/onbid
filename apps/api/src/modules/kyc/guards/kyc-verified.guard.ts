import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.type';

/**
 * PRD §4.1: "PAN and Aadhaar verification is mandatory for every account
 * before listing or bidding." Must run after JwtAuthGuard (needs
 * request.user). Deliberately re-reads kycStatus from Postgres instead of
 * trusting the JWT payload — the token can be up to 15 minutes old, and this
 * gate sits directly in front of real money movement (listing fees, bids),
 * so a stale PENDING->VERIFIED (or worse, VERIFIED->REJECTED) transition
 * shouldn't slip through for the token's remaining lifetime.
 */
@Injectable()
export class KycVerifiedGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    if (!request.user) return false;

    const user = await this.prisma.user.findUnique({
      where: { id: request.user.id },
      select: { kycStatus: true },
    });

    if (!user || user.kycStatus !== 'VERIFIED') {
      throw new ForbiddenException(
        'PAN and Aadhaar verification must be complete before you can do this',
      );
    }
    return true;
  }
}
