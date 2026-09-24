import { Role } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { AuctionsService } from '../auctions/auctions.service';
import { CreateVerifierDto } from './dto/create-verifier.dto';
import { ScheduleVerificationDto } from './dto/schedule-verification.dto';
import { CompleteVerificationDto } from './dto/complete-verification.dto';
import { VERIFICATION_CHECKLIST_TEMPLATES } from './verification-checklists';
import {
  VERIFICATION_EVENTS,
  VerificationAssignedEvent,
  VerificationOutcomeEvent,
} from './events/verification.events';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auctionsService: AuctionsService,
    private readonly events: EventEmitter2,
  ) {}

  // --- Verifier profile (minimal — full admin tooling is Phase 6) ---

  async createVerifier(dto: CreateVerifierDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.verifier.findUnique({ where: { userId: dto.userId } });
    if (existing) throw new BadRequestException('This user is already a verifier');

    const roles = user.roles.includes(Role.VERIFIER) ? user.roles : [...user.roles, Role.VERIFIER];

    const [, verifier] = await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: dto.userId }, data: { roles } }),
      this.prisma.verifier.create({
        data: { userId: dto.userId, coverageArea: dto.coverageArea },
      }),
    ]);
    return verifier;
  }

  // --- Called from PaymentsModule's event once the ₹49 fee is confirmed ---

  async createRequestFromPaidFee(listingId: string, verificationFeePaymentId: string) {
    const request = await this.prisma.verificationRequest.create({
      data: { listingId, status: 'PENDING' },
    });

    await this.prisma.$transaction([
      this.prisma.verificationFeePayment.update({
        where: { id: verificationFeePaymentId },
        data: { verificationRequestId: request.id },
      }),
      this.prisma.auction.update({
        where: { id: listingId },
        data: { status: 'PENDING_VERIFICATION', currentVerificationRequestId: request.id },
      }),
    ]);

    return request;
  }

  // --- Verifier-facing queue ---

  private async requireVerifier(userId: string) {
    const verifier = await this.prisma.verifier.findUnique({ where: { userId } });
    if (!verifier || !verifier.active) {
      throw new ForbiddenException('You are not registered as an active verifier');
    }
    return verifier;
  }

  /** Lowercases status (and the nested listing's category/status, if present) to match the frontend's VerificationRequest type. */
  private toResponse(request: Record<string, unknown>) {
    const listing = request.listing as Record<string, unknown> | undefined;
    return {
      ...request,
      status: (request.status as string).toLowerCase(),
      listing: listing
        ? {
            ...listing,
            category: (listing.category as string).toLowerCase(),
            status: (listing.status as string).toLowerCase(),
          }
        : undefined,
    };
  }

  async getQueue(verifierUserId: string) {
    const verifier = await this.requireVerifier(verifierUserId);

    const requests = await this.prisma.verificationRequest.findMany({
      where: {
        OR: [
          {
            status: 'PENDING',
            verifierId: null,
            listing: { sellerLocation: verifier.coverageArea },
          },
          { verifierId: verifier.id, status: { in: ['PENDING', 'SCHEDULED'] } },
        ],
      },
      include: { listing: true },
      orderBy: { createdAt: 'asc' },
    });
    return requests.map((r: Record<string, unknown>) => this.toResponse(r));
  }

  /** Atomic claim-and-schedule — two verifiers racing for the same request can't both win it. */
  async schedule(requestId: string, verifierUserId: string, dto: ScheduleVerificationDto) {
    const verifier = await this.requireVerifier(verifierUserId);

    const claimed = await this.prisma.verificationRequest.updateMany({
      where: { id: requestId, verifierId: null, status: 'PENDING' },
      data: {
        verifierId: verifier.id,
        status: 'SCHEDULED',
        scheduledAt: new Date(dto.scheduledAt),
      },
    });

    if (claimed.count > 0) {
      const request = await this.prisma.verificationRequest.findUnique({
        where: { id: requestId },
        include: { listing: true },
      });
      if (request) {
        this.events.emit(
          VERIFICATION_EVENTS.ASSIGNED,
          new VerificationAssignedEvent(
            request.listingId,
            request.listing.sellerId,
            request.listing.title,
          ),
        );
      }
      return request ? this.toResponse(request) : request;
    }

    // Claim didn't happen — figure out why, for a clear error rather than a silent no-op.
    const existing = await this.prisma.verificationRequest.findUnique({ where: { id: requestId } });
    if (!existing) throw new NotFoundException('Verification request not found');
    if (existing.verifierId === verifier.id) {
      // Already claimed by this same verifier — treat as a reschedule.
      const rescheduled = await this.prisma.verificationRequest.update({
        where: { id: requestId },
        data: { scheduledAt: new Date(dto.scheduledAt) },
      });
      return this.toResponse(rescheduled);
    }
    if (existing.verifierId) {
      throw new ConflictException('This request has already been claimed by another verifier');
    }
    throw new BadRequestException(
      `Cannot schedule a request that is already ${existing.status.toLowerCase()}`,
    );
  }

  async complete(requestId: string, verifierUserId: string, dto: CompleteVerificationDto) {
    const verifier = await this.requireVerifier(verifierUserId);

    const request = await this.prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: { listing: true },
    });
    if (!request) throw new NotFoundException('Verification request not found');
    if (request.verifierId !== verifier.id) {
      throw new ForbiddenException('This request is not assigned to you');
    }
    if (request.status !== 'SCHEDULED') {
      throw new BadRequestException(
        `Cannot complete a request that is ${request.status.toLowerCase()}`,
      );
    }

    this.assertChecklistMatchesTemplate(request.listing.category, dto.checklist);

    await this.prisma.verificationRequest.update({
      where: { id: requestId },
      data: {
        status: dto.verdict,
        checklist: dto.checklist,
        photos: dto.photos,
        notes: dto.notes,
        completedAt: new Date(),
      },
    });

    // Lifecycle transition belongs to the auctions module, not here.
    await this.auctionsService.handleVerificationOutcome(request.listingId, dto.verdict);

    this.events.emit(
      dto.verdict === 'PASSED' ? VERIFICATION_EVENTS.PASSED : VERIFICATION_EVENTS.FAILED,
      new VerificationOutcomeEvent(
        request.listingId,
        request.listing.sellerId,
        request.listing.title,
        dto.notes ?? null,
      ),
    );

    return { requestId, verdict: dto.verdict.toLowerCase() };
  }

  private assertChecklistMatchesTemplate(
    category: keyof typeof VERIFICATION_CHECKLIST_TEMPLATES,
    checklist: Record<string, boolean>,
  ): void {
    const template = VERIFICATION_CHECKLIST_TEMPLATES[category];
    const templateIds = new Set(template.map((item) => item.id));
    const providedIds = Object.keys(checklist);

    const unknown = providedIds.filter((id) => !templateIds.has(id));
    if (unknown.length > 0) {
      throw new BadRequestException(
        `Unknown checklist item(s) for ${category}: ${unknown.join(', ')}`,
      );
    }
    const missing = [...templateIds].filter((id) => !providedIds.includes(id));
    if (missing.length > 0) {
      throw new BadRequestException(`Missing checklist item(s): ${missing.join(', ')}`);
    }
  }
}
