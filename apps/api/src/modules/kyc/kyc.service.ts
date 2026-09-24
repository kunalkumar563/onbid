import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { KYC_PROVIDER, KycProvider } from './providers/kyc-provider.interface';
import { InitiateKycDto } from './dto/initiate-kyc.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);
  private readonly providerName: string;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(KYC_PROVIDER) private readonly kycProvider: KycProvider,
    private readonly config: ConfigService,
  ) {
    this.providerName = this.config.get<string>('kyc.provider', 'signzy');
  }

  async initiate(userId: string, dto: InitiateKycDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existingForDoc = await this.prisma.kycVerification.findFirst({
      where: { userId, documentType: dto.documentType, status: 'VERIFIED' },
    });
    if (existingForDoc) {
      throw new BadRequestException(`${dto.documentType.toUpperCase()} is already verified`);
    }

    const result = await this.kycProvider.initiateVerification({
      userId,
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth.toISOString().slice(0, 10),
    });

    const verification = await this.prisma.kycVerification.upsert({
      where: {
        provider_providerRefId: {
          provider: this.providerName,
          providerRefId: result.providerRefId,
        },
      },
      create: {
        userId,
        provider: this.providerName,
        providerRefId: result.providerRefId,
        documentType: dto.documentType,
        status: result.status,
        rawStatusPayload: result.raw as any,
      },
      update: {
        status: result.status,
        rawStatusPayload: result.raw as any,
      },
    });

    if (result.status !== 'PENDING') {
      await this.recomputeUserKycStatus(userId);
    }

    return {
      documentType: verification.documentType,
      status: verification.status,
      providerRefId: verification.providerRefId,
    };
  }

  /**
   * Called from the public webhook endpoint. The provider adapter is
   * responsible for verifying the request actually came from the vendor
   * (see SignzyProvider.parseWebhook) before we ever trust its contents.
   */
  async handleWebhook(
    payload: unknown,
    headers: Record<string, string>,
    rawBody: string,
  ): Promise<void> {
    const result = this.kycProvider.parseWebhook(payload, headers, rawBody);

    const verification = await this.prisma.kycVerification.findUnique({
      where: {
        provider_providerRefId: {
          provider: this.providerName,
          providerRefId: result.providerRefId,
        },
      },
    });

    if (!verification) {
      this.logger.warn(
        `Received KYC webhook for unknown providerRefId=${result.providerRefId} — ignoring`,
      );
      return;
    }

    await this.prisma.kycVerification.update({
      where: { id: verification.id },
      data: { status: result.status, rawStatusPayload: result.raw as any },
    });

    await this.recomputeUserKycStatus(verification.userId);
  }

  /**
   * PRD §4.1: "PAN and Aadhaar verification is mandatory" — read as both
   * documents needing to pass, not either/or. VERIFIED only once both have a
   * VERIFIED KycVerification row; REJECTED as soon as either is rejected
   * (matches "fail closed" for anything gating money movement); otherwise PENDING.
   */
  private async recomputeUserKycStatus(userId: string): Promise<void> {
    const verifications = await this.prisma.kycVerification.findMany({ where: { userId } });

    const panOk = verifications.some(
      (v: { documentType: string; status: string }) =>
        v.documentType === 'pan' && v.status === 'VERIFIED',
    );
    const aadhaarOk = verifications.some(
      (v: { documentType: string; status: string }) =>
        v.documentType === 'aadhaar' && v.status === 'VERIFIED',
    );
    const anyRejected = verifications.some((v: { status: string }) => v.status === 'REJECTED');

    const kycStatus = anyRejected ? 'REJECTED' : panOk && aadhaarOk ? 'VERIFIED' : 'PENDING';

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus,
        kycVerifiedAt: kycStatus === 'VERIFIED' ? new Date() : null,
      },
    });
  }

  async getStatus(userId: string) {
    const [user, verifications] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId }, select: { kycStatus: true } }),
      this.prisma.kycVerification.findMany({
        where: { userId },
        select: { documentType: true, status: true, createdAt: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);
    if (!user) throw new NotFoundException('User not found');
    return { overallStatus: user.kycStatus, verifications };
  }
}
