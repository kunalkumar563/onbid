import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../database/prisma.service';
import { RefreshTokenStore } from './refresh-token.store';
import { EmailService } from '../notifications/email.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: Record<string, jest.Mock> };
  let jwtService: { sign: jest.Mock };
  let refreshTokens: Record<string, jest.Mock>;
  let config: { get: jest.Mock };
  let emailService: { send: jest.Mock };

  const baseUser = {
    id: 'user-1',
    email: 'kavya@example.com',
    passwordHash: null as string | null,
    fullName: 'Kavya Rao',
    phone: null as string | null,
    dateOfBirth: new Date('2003-01-01'),
    authProvider: 'LOCAL',
    roles: ['BUYER', 'SELLER'],
    kycStatus: 'PENDING',
    kycVerifiedAt: null,
    passwordResetTokenHash: null as string | null,
    passwordResetExpiresAt: null as Date | null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };
    jwtService = { sign: jest.fn().mockReturnValue('signed.access.token') };
    refreshTokens = {
      issue: jest.fn().mockResolvedValue('opaque-refresh-token'),
      verify: jest.fn(),
      rotate: jest.fn(),
      revoke: jest.fn(),
      revokeAllForUser: jest.fn(),
    };
    config = { get: jest.fn((_key: string, fallback?: unknown) => fallback ?? false) };
    emailService = { send: jest.fn().mockResolvedValue(undefined) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: RefreshTokenStore, useValue: refreshTokens },
        { provide: ConfigService, useValue: config },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  describe('register', () => {
    it('rejects users under 18', async () => {
      const dto = {
        email: 'young@example.com',
        password: 'password1',
        fullName: 'Too Young',
        dateOfBirth: new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
      };
      await expect(service.register(dto)).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('rejects duplicate emails', async () => {
      prisma.user.findUnique.mockResolvedValue(baseUser);
      const dto = {
        email: baseUser.email,
        password: 'password1',
        fullName: 'Someone',
        dateOfBirth: '2000-01-01',
      };
      await expect(service.register(dto)).rejects.toBeInstanceOf(ConflictException);
    });

    it('hashes the password and issues tokens on success', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...baseUser, passwordHash: 'hashed' });

      const result = await service.register({
        email: baseUser.email,
        password: 'password1',
        fullName: baseUser.fullName,
        dateOfBirth: '2000-01-01',
      });

      const createArgs = prisma.user.create.mock.calls[0][0].data;
      expect(createArgs.passwordHash).not.toBe('password1'); // never store plaintext
      expect(result.tokens.accessToken).toBe('signed.access.token');
      expect(result.tokens.refreshToken).toBe('opaque-refresh-token');
      expect(refreshTokens.issue).toHaveBeenCalledWith(baseUser.id);
    });
  });

  describe('login', () => {
    it('rejects unknown emails without revealing that the account does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'nope@example.com', password: 'whatever1' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects Google-only accounts trying to password-login', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...baseUser, passwordHash: null });
      await expect(
        service.login({ email: baseUser.email, password: 'whatever1' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects a wrong password', async () => {
      const hash = await bcrypt.hash('correct-password', 4);
      prisma.user.findUnique.mockResolvedValue({ ...baseUser, passwordHash: hash });
      await expect(
        service.login({ email: baseUser.email, password: 'wrong-password' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('issues tokens on a correct password', async () => {
      const hash = await bcrypt.hash('correct-password', 4);
      prisma.user.findUnique.mockResolvedValue({ ...baseUser, passwordHash: hash });

      const result = await service.login({ email: baseUser.email, password: 'correct-password' });
      expect(result.tokens.accessToken).toBe('signed.access.token');
    });
  });

  describe('refresh', () => {
    it('rejects an invalid/expired refresh token', async () => {
      refreshTokens.verify.mockResolvedValue(null);
      await expect(service.refresh('garbage')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rotates the token: old one is dead, a new one is issued', async () => {
      refreshTokens.verify.mockResolvedValue(baseUser.id);
      refreshTokens.rotate.mockResolvedValue('new-refresh-token');
      prisma.user.findUnique.mockResolvedValue(baseUser);

      const result = await service.refresh('old-refresh-token');

      expect(refreshTokens.rotate).toHaveBeenCalledWith('old-refresh-token', baseUser.id);
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('revokes the token and rejects if the user no longer exists', async () => {
      refreshTokens.verify.mockResolvedValue('deleted-user-id');
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.refresh('some-token')).rejects.toBeInstanceOf(UnauthorizedException);
      expect(refreshTokens.revoke).toHaveBeenCalledWith('some-token', 'deleted-user-id');
    });
  });

  describe('register with DEMO_MODE', () => {
    it('leaves KYC PENDING when demo mode is off (the default)', async () => {
      config.get.mockImplementation((key: string, fallback?: unknown) =>
        key === 'demoMode' ? false : fallback,
      );
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...baseUser, kycStatus: 'PENDING' });

      await service.register({
        email: baseUser.email,
        password: 'password1',
        fullName: baseUser.fullName,
        dateOfBirth: '2000-01-01',
      });

      const createArgs = prisma.user.create.mock.calls[0][0].data;
      expect(createArgs.kycStatus).toBe('PENDING');
      expect(createArgs.kycVerifiedAt).toBeNull();
    });

    it('auto-verifies KYC when demo mode is on', async () => {
      config.get.mockImplementation((key: string, fallback?: unknown) =>
        key === 'demoMode' ? true : fallback,
      );
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...baseUser, kycStatus: 'VERIFIED' });

      await service.register({
        email: baseUser.email,
        password: 'password1',
        fullName: baseUser.fullName,
        dateOfBirth: '2000-01-01',
      });

      const createArgs = prisma.user.create.mock.calls[0][0].data;
      expect(createArgs.kycStatus).toBe('VERIFIED');
      expect(createArgs.kycVerifiedAt).toBeInstanceOf(Date);
    });
  });

  describe('forgotPassword / resetPassword', () => {
    it('does nothing (no error, no email) for an email that does not exist — never reveals which emails are registered', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await service.forgotPassword('nobody@example.com');
      expect(emailService.send).not.toHaveBeenCalled();
    });

    it('emails a reset link and stores only a hash of the token, never the raw token', async () => {
      prisma.user.findUnique.mockResolvedValue(baseUser);
      prisma.user.update.mockResolvedValue(baseUser);

      await service.forgotPassword(baseUser.email);

      expect(emailService.send).toHaveBeenCalledTimes(1);
      const [, , body] = emailService.send.mock.calls[0];
      const updateArgs = prisma.user.update.mock.calls[0][0].data;

      // Extract the raw token from the email body and confirm it's NOT what got stored.
      const rawToken = /token=([a-f0-9]+)/.exec(body)?.[1];
      expect(rawToken).toBeTruthy();
      expect(updateArgs.passwordResetTokenHash).not.toBe(rawToken);
      expect(updateArgs.passwordResetExpiresAt).toBeInstanceOf(Date);
    });

    it('rejects an expired reset token', async () => {
      prisma.user.findFirst.mockResolvedValue({
        ...baseUser,
        passwordResetTokenHash: 'some-hash',
        passwordResetExpiresAt: new Date(Date.now() - 1000), // already expired
      });

      await expect(service.resetPassword('raw-token', 'newpassword1')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('rejects a token that matches no user', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.resetPassword('bogus-token', 'newpassword1')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('on success, updates the password, clears the reset token, and revokes every existing session', async () => {
      prisma.user.findFirst.mockResolvedValue({
        ...baseUser,
        passwordResetTokenHash: 'some-hash',
        passwordResetExpiresAt: new Date(Date.now() + 1000 * 60),
      });
      prisma.user.update.mockResolvedValue(baseUser);

      await service.resetPassword('raw-token', 'newpassword1');

      const updateArgs = prisma.user.update.mock.calls[0][0].data;
      expect(updateArgs.passwordHash).not.toBe('newpassword1'); // never stored in plaintext
      expect(updateArgs.passwordResetTokenHash).toBeNull();
      expect(refreshTokens.revokeAllForUser).toHaveBeenCalledWith(baseUser.id);
    });
  });
});
