import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { RefreshTokenStore } from './refresh-token.store';
import { EmailService } from '../notifications/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { AccessTokenPayload } from './types/authenticated-user.type';
import type { User } from '@prisma/client';

const MIN_AGE_YEARS = 18;
const BCRYPT_ROUNDS = 12;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Frontend-shaped user: a single lowercase `role` alongside the real
 * `roles` array. The frontend's whole navigation model (ROLE_DASHBOARD_PATH,
 * permission maps) is built around exactly one role per account; my
 * backend gives every account both BUYER and SELLER by design (see
 * README's Phase 2 assumptions). `role` here is a best-effort primary
 * label for that navigation to key off of — ADMIN/VERIFIER win if granted,
 * otherwise "bidder" — not a claim that the richer roles array is wrong.
 * Worth a real product conversation about whether accounts should get a
 * role switcher instead; flagged in the README, not resolved silently here.
 */
export interface PublicUser {
  id: string;
  email: string;
  phone: string | null;
  fullName: string;
  role: 'bidder' | 'seller' | 'verifier' | 'admin';
  roles: string[];
  kycStatus: string;
  createdAt: Date;
}

function primaryRole(roles: string[]): PublicUser['role'] {
  if (roles.includes('ADMIN')) return 'admin';
  if (roles.includes('VERIFIER')) return 'verifier';
  return 'bidder';
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly refreshTokens: RefreshTokenStore,
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone ?? null,
      fullName: user.fullName,
      role: primaryRole(user.roles),
      roles: user.roles,
      kycStatus: user.kycStatus.toLowerCase(),
      createdAt: user.createdAt,
    };
  }

  private assertMinimumAge(dateOfBirth: string): void {
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) {
      throw new BadRequestException('dateOfBirth is not a valid date');
    }
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;

    if (age < MIN_AGE_YEARS) {
      throw new BadRequestException(`You must be at least ${MIN_AGE_YEARS} to register on Onbid`);
    }
  }

  private async issueTokens(user: User): Promise<AuthTokens> {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      kycStatus: user.kycStatus,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.refreshTokens.issue(user.id);
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    this.assertMinimumAge(dto.dateOfBirth);

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const demoMode = this.config.get<boolean>('demoMode', false);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        phone: dto.phone,
        dateOfBirth: new Date(dto.dateOfBirth),
        authProvider: 'LOCAL',
        // roles default to [BUYER, SELLER] per schema — every account can both
        // list and bid; VERIFIER/ADMIN are granted separately, not self-selected.
        //
        // DEMO_MODE: auto-verified, since there's no real Signzy submission
        // a demo account could complete live anyway (see README/config
        // comment) — every other KYC code path (webhook, both documents
        // required) is untouched and still real for non-demo accounts.
        kycStatus: demoMode ? 'VERIFIED' : 'PENDING',
        kycVerifiedAt: demoMode ? new Date() : null,
      },
    });

    if (demoMode) {
      this.logger.warn(`DEMO_MODE: auto-verified KYC for new user ${user.id} (${user.email})`);
    }

    const tokens = await this.issueTokens(user);
    return { user: this.toPublicUser(user), tokens };
  }

  async login(dto: LoginDto): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    // Same error for "no such user" and "wrong password" — don't leak which one it was.
    const invalidCredentials = () => new UnauthorizedException('Invalid email or password');

    if (!user || !user.passwordHash) {
      // !user.passwordHash covers Google-only accounts trying to password-login
      throw invalidCredentials();
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) throw invalidCredentials();

    const tokens = await this.issueTokens(user);
    return { user: this.toPublicUser(user), tokens };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const userId = await this.refreshTokens.verify(refreshToken);
    if (!userId) throw new UnauthorizedException('Refresh token is invalid or expired');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      // User was deleted after the token was issued — clean up and reject.
      await this.refreshTokens.revoke(refreshToken, userId);
      throw new UnauthorizedException();
    }

    // Rotation: old token is dead the moment a new one is issued from it.
    const newRefreshToken = await this.refreshTokens.rotate(refreshToken, user.id);
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      kycStatus: user.kycStatus,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.refreshTokens.revoke(refreshToken, userId);
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.toPublicUser(user);
  }

  /**
   * Always resolves the same way regardless of whether the email exists —
   * standard practice so this endpoint can't be used to enumerate
   * registered accounts. Only actually sends an email if it does.
   */
  async forgotPassword(email: string): Promise<{token?: string}> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return {};

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const frontendUrl = this.config.get<string>('frontendUrl', 'http://localhost:5173');
    const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

    await this.emailService.send(
      user.email,
      'Reset your Onbid password',
      `We received a request to reset your Onbid password. This link expires in 1 hour:\n\n${resetLink}\n\nIf you didn't request this, you can ignore this email.`,
    );
    return { token: rawToken };
  }

  async resetPassword(rawToken: string, newPassword: string): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: { passwordResetTokenHash: tokenHash },
    });

    if (
      !user ||
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException('This reset link is invalid or has expired');
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });

    // Standard practice after any password change: kill every existing
    // session so a stolen-but-not-yet-used old token can't outlive the
    // password that granted it.
    await this.refreshTokens.revokeAllForUser(user.id);

    const updatedUser = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!updatedUser) throw new BadRequestException();
    const tokens = await this.issueTokens(updatedUser);
    return { user: this.toPublicUser(updatedUser), tokens };
  }

  async updateProfile(userId: string, data: any): Promise<PublicUser> {
    const { fullName, phone, dateOfBirth } = data;
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(dateOfBirth !== undefined && dateOfBirth !== '' && { dateOfBirth: new Date(dateOfBirth) })
      }
    });
    return this.toPublicUser(user);
  }
}
