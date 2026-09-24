import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { KycService } from './kyc.service';
import { PrismaService } from '../../database/prisma.service';
import { KycProvider } from './providers/kyc-provider.interface';

describe('KycService', () => {
  let service: KycService;
  let prisma: any;
  let provider: jest.Mocked<KycProvider>;

  const user = {
    id: 'user-1',
    fullName: 'Kavya Rao',
    dateOfBirth: new Date('2000-01-01'),
  };

  beforeEach(() => {
    prisma = {
      user: { findUnique: jest.fn().mockResolvedValue(user), update: jest.fn() },
      kycVerification: {
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        upsert: jest.fn(),
        update: jest.fn(),
      },
    };
    provider = {
      initiateVerification: jest.fn(),
      parseWebhook: jest.fn(),
    };
    const config = { get: jest.fn().mockReturnValue('signzy') } as unknown as ConfigService;

    service = new KycService(prisma as unknown as PrismaService, provider, config);
  });

  describe('initiate', () => {
    it('throws if the user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.initiate('missing-user', { documentType: 'pan', documentNumber: 'ABCDE1234F' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('refuses to re-verify a document that already passed', async () => {
      prisma.kycVerification.findFirst.mockResolvedValue({ id: 'existing', status: 'VERIFIED' });
      await expect(
        service.initiate('user-1', { documentType: 'pan', documentNumber: 'ABCDE1234F' }),
      ).rejects.toThrow(/already verified/i);
    });

    it('calls the provider and stores the resulting verification row', async () => {
      provider.initiateVerification.mockResolvedValue({
        providerRefId: 'ref-123',
        status: 'PENDING',
        raw: { status: 'pending' },
      });
      prisma.kycVerification.upsert.mockResolvedValue({
        documentType: 'pan',
        status: 'PENDING',
        providerRefId: 'ref-123',
      });

      const result = await service.initiate('user-1', {
        documentType: 'pan',
        documentNumber: 'ABCDE1234F',
      });

      expect(provider.initiateVerification).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-1', documentType: 'pan' }),
      );
      expect(result.providerRefId).toBe('ref-123');
      expect(prisma.user.update).not.toHaveBeenCalled(); // still PENDING — no status rollup yet
    });
  });

  describe('handleWebhook', () => {
    it('ignores callbacks for a providerRefId we have no record of', async () => {
      provider.parseWebhook.mockReturnValue({
        providerRefId: 'unknown-ref',
        status: 'VERIFIED',
        raw: {},
      });
      prisma.kycVerification.findUnique.mockResolvedValue(null);

      await service.handleWebhook({}, {}, '{}');

      expect(prisma.kycVerification.update).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('marks the user VERIFIED only once both PAN and Aadhaar have passed', async () => {
      provider.parseWebhook.mockReturnValue({
        providerRefId: 'ref-aadhaar',
        status: 'VERIFIED',
        raw: {},
      });
      prisma.kycVerification.findUnique.mockResolvedValue({
        id: 'kv-2',
        userId: 'user-1',
        documentType: 'aadhaar',
      });
      // After this webhook, PAN was already verified earlier and Aadhaar just passed.
      prisma.kycVerification.findMany.mockResolvedValue([
        { documentType: 'pan', status: 'VERIFIED' },
        { documentType: 'aadhaar', status: 'VERIFIED' },
      ]);

      await service.handleWebhook({}, {}, '{}');

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({ kycStatus: 'VERIFIED' }),
        }),
      );
    });

    it('marks the user REJECTED as soon as either document fails, even if the other passed', async () => {
      provider.parseWebhook.mockReturnValue({
        providerRefId: 'ref-pan',
        status: 'REJECTED',
        raw: {},
      });
      prisma.kycVerification.findUnique.mockResolvedValue({
        id: 'kv-1',
        userId: 'user-1',
        documentType: 'pan',
      });
      prisma.kycVerification.findMany.mockResolvedValue([
        { documentType: 'pan', status: 'REJECTED' },
        { documentType: 'aadhaar', status: 'VERIFIED' },
      ]);

      await service.handleWebhook({}, {}, '{}');

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ kycStatus: 'REJECTED' }) }),
      );
    });
  });
});
