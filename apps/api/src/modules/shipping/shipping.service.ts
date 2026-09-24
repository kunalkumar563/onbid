import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { EscrowService } from '../escrow/escrow.service';
import { PredispatchPhotosDto } from './dto/predispatch-photos.dto';
import { DeliveryConfirmationDto } from './dto/delivery-confirmation.dto';
import { PredispatchRecordedEvent, SHIPPING_EVENTS } from './events/shipping.events';

@Injectable()
export class ShippingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly escrowService: EscrowService,
    private readonly events: EventEmitter2,
  ) {}

  async submitPredispatchPhotos(
    transactionId: string,
    sellerId: string,
    dto: PredispatchPhotosDto,
  ) {
    const transaction = await this.escrowService.getTransactionOr404(transactionId);
    if (transaction.sellerId !== sellerId) {
      throw new ForbiddenException('Only the seller on this transaction can record dispatch');
    }
    if (transaction.status !== 'PAID') {
      throw new BadRequestException(
        `Cannot record dispatch for a transaction that is ${transaction.status.toLowerCase()} — payment must be captured first`,
      );
    }

    const proof = await this.prisma.deliveryProof.upsert({
      where: { transactionId },
      create: {
        transactionId,
        sellerPredispatchPhotos: dto.photos,
        courierName: dto.courierName,
        trackingNumber: dto.trackingNumber,
        predispatchUploadedAt: new Date(),
      },
      update: {
        sellerPredispatchPhotos: dto.photos,
        courierName: dto.courierName,
        trackingNumber: dto.trackingNumber,
        predispatchUploadedAt: new Date(),
      },
    });

    const auction = await this.prisma.auction.findUnique({
      where: { id: transaction.auctionId },
      select: { title: true },
    });
    this.events.emit(
      SHIPPING_EVENTS.PREDISPATCH_RECORDED,
      new PredispatchRecordedEvent(
        transactionId,
        transaction.buyerId,
        auction?.title ?? 'your item',
        dto.courierName,
        dto.trackingNumber,
      ),
    );

    return proof;
  }

  /**
   * PRD §4.6's step order (seller ships, THEN buyer receives) is enforced
   * here, not just implied by the UI — a buyer can't confirm delivery of
   * something that was never recorded as dispatched.
   */
  async confirmDelivery(transactionId: string, buyerId: string, dto: DeliveryConfirmationDto) {
    const transaction = await this.escrowService.getTransactionOr404(transactionId);
    if (transaction.buyerId !== buyerId) {
      throw new ForbiddenException('Only the buyer on this transaction can confirm delivery');
    }

    const proof = await this.prisma.deliveryProof.findUnique({ where: { transactionId } });
    if (!proof?.predispatchUploadedAt) {
      throw new BadRequestException(
        'The seller has not yet recorded dispatch for this item — nothing to confirm receipt of',
      );
    }
    if (proof.receiptUploadedAt) {
      throw new BadRequestException('Delivery has already been confirmed for this transaction');
    }

    await this.prisma.deliveryProof.update({
      where: { transactionId },
      data: { buyerReceiptPhotos: dto.photos, receiptUploadedAt: new Date() },
    });

    // This is what actually starts the 3-day auto-release countdown —
    // EscrowService requires status PAID -> DELIVERED, matching the
    // transaction's real state.
    await this.escrowService.markDelivered(transactionId);

    return { confirmed: true };
  }

  async getProof(transactionId: string, requestingUserId: string) {
    // Reuses escrow's buyer-or-seller check so "who can see this" stays
    // defined in exactly one place.
    await this.escrowService.getForParticipant(transactionId, requestingUserId);

    const proof = await this.prisma.deliveryProof.findUnique({ where: { transactionId } });
    if (!proof) throw new NotFoundException('No delivery proof recorded yet for this transaction');
    return proof;
  }
}
