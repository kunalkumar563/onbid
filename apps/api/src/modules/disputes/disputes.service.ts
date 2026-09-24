import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EscrowService } from '../escrow/escrow.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@Injectable()
export class DisputesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly escrowService: EscrowService,
  ) {}

  /** Lowercases status/resolution and flattens raisedBy/resolvedBy to plain ids, matching the frontend's Dispute type exactly. */
  private toResponse(dispute: Record<string, unknown>) {
    return {
      ...dispute,
      raisedBy: dispute.raisedById ?? dispute.raisedBy,
      resolvedBy: dispute.resolvedById ?? dispute.resolvedBy ?? null,
      status: (dispute.status as string).toLowerCase(),
      resolution: (dispute.resolution as string).toLowerCase(),
    };
  }

  async create(userId: string, dto: CreateDisputeDto) {
    const transaction = await this.escrowService.getTransactionOr404(dto.transactionId);

    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      throw new ForbiddenException('You are not a party to this transaction');
    }
    // PRD §4.7 frames this specifically as a "post-delivery dispute" — the
    // buyer's receipt confirmation is what makes there something concrete
    // to dispute (the item as received vs. as verified/described).
    if (transaction.status !== 'DELIVERED') {
      throw new BadRequestException(
        `Disputes can only be raised once delivery has been confirmed (transaction is currently ${transaction.status.toLowerCase()})`,
      );
    }

    const existingOpen = await this.prisma.dispute.findFirst({
      where: { transactionId: dto.transactionId, status: { in: ['OPEN', 'UNDER_REVIEW'] } },
    });
    if (existingOpen) {
      throw new BadRequestException('This transaction already has an open dispute');
    }

    const dispute = await this.prisma.dispute.create({
      data: { transactionId: dto.transactionId, raisedById: userId, reason: dto.reason },
    });

    await this.escrowService.recordDisputeOpened(dto.transactionId, dispute.id);

    return this.toResponse(dispute);
  }

  /** Admin queue — filterable so Retool can show "open" by default and let an admin drill into history. */
  async list(status?: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED') {
    const disputes = await this.prisma.dispute.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'asc' },
      include: { transaction: true },
    });
    // Wrapped in { disputes: [...] } — matches the frontend's
    // AdminDisputeListResponse type exactly, not a bare array.
    return { disputes: disputes.map((d: Record<string, unknown>) => this.toResponse(d)) };
  }

  /**
   * Everything an admin needs on one screen per Phase 6's "done when": both
   * photo sets, the original verification checklist, and the dispute
   * itself. Retool binds directly to this shape.
   */
  async getDetail(disputeId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        transaction: {
          include: {
            auction: { include: { currentVerificationRequest: true } },
            deliveryProof: true,
          },
        },
        raisedBy: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');
    return {
      ...this.toResponse(dispute as unknown as Record<string, unknown>),
      raisedByUser: dispute.raisedBy, // the richer nested object, alongside the flat `raisedBy` id from toResponse
    };
  }

  async resolve(disputeId: string, adminUserId: string, dto: ResolveDisputeDto) {
    const dispute = await this.prisma.dispute.findUnique({ where: { id: disputeId } });
    if (!dispute) throw new NotFoundException('Dispute not found');
    if (dispute.status === 'RESOLVED') {
      throw new BadRequestException('This dispute has already been resolved');
    }

    // Mark resolved BEFORE triggering the escrow action — release() checks
    // for an open dispute, and this dispute must no longer count as one by
    // the time NO_REFUND/PARTIAL_REFUND call back into it.
    await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: 'RESOLVED',
        resolution: dto.resolution,
        refundAmount: dto.resolution === 'PARTIAL_REFUND' ? dto.refundAmount : undefined,
        resolvedById: adminUserId,
        resolvedAt: new Date(),
      },
    });

    switch (dto.resolution) {
      case 'FULL_REFUND':
        await this.escrowService.refundFull(dispute.transactionId, disputeId);
        break;
      case 'PARTIAL_REFUND':
        // DTO validation guarantees refundAmount is present for this branch.
        await this.escrowService.refundPartialAndRelease(
          dispute.transactionId,
          disputeId,
          dto.refundAmount as number,
        );
        break;
      case 'NO_REFUND':
        await this.escrowService.release(dispute.transactionId);
        break;
    }

    return this.getDetail(disputeId);
  }
}
