import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Auction, AuctionCategory, AuctionStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import {
  CATEGORY_MIN_PRICE,
  VALID_SUBCATEGORIES,
  VALID_SUBSUBCATEGORIES,
} from './listings.constants';

// A seller can (re)submit for verification from either of these states —
// DRAFT for a first submission, REJECTED for a resubmission after a fail
// (PRD §5's bidirectional verification_request FK only makes sense if
// resubmission is possible; see schema.prisma comment).
const SUBMITTABLE_STATUSES: AuctionStatus[] = ['DRAFT', 'REJECTED'];

// A seller can only edit content while nothing is in flight against it yet.
const EDITABLE_STATUSES: AuctionStatus[] = ['DRAFT', 'REJECTED'];

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  private assertMeetsMinimumPrice(category: AuctionCategory, startingPrice: number): void {
    const minimum = CATEGORY_MIN_PRICE[category];
    if (startingPrice < minimum) {
      throw new BadRequestException(`Starting price for ${category} must be at least ₹${minimum}`);
    }
  }

  private assertValidSubcategoryTree(
    category: AuctionCategory,
    subCategory: string,
    subSubCategory: string,
  ): void {
    const validSubs = VALID_SUBCATEGORIES[category] ?? [];
    if (!validSubs.includes(subCategory)) {
      throw new BadRequestException(`"${subCategory}" is not a valid subcategory of ${category}`);
    }
    const validSubSubs = VALID_SUBSUBCATEGORIES[subCategory] ?? [];
    if (!validSubSubs.includes(subSubCategory)) {
      throw new BadRequestException(
        `"${subSubCategory}" is not a valid sub-subcategory of "${subCategory}"`,
      );
    }
  }

  /**
   * Reshapes the internal Auction row into exactly the frontend's `Listing`
   * type — lowercase status/category/verificationStatus, `auctionDuration`
   * instead of `durationHours` (kept as an additional alias too, in case
   * anything reads the other name), `verificationRequestId` instead of
   * `currentVerificationRequestId`. Internal code everywhere else keeps
   * using the real Prisma shape; only the API boundary looks like this.
   */
  private toListingResponse(auction: Auction) {
    return {
      id: auction.id,
      sellerId: auction.sellerId,
      title: auction.title,
      category: auction.category.toLowerCase(),
      subCategory: auction.subCategory ?? '',
      subSubCategory: auction.subSubCategory ?? '',
      description: auction.description,
      startingPrice: Number(auction.startingPrice),
      auctionDuration: auction.durationHours,
      durationHours: auction.durationHours, // alias — see class comment
      photos: auction.photos,
      sellerLocation: auction.sellerLocation,
      status: auction.status.toLowerCase(),
      verificationRequestId: auction.currentVerificationRequestId,
      verificationStatus: auction.verificationStatus
        ? (auction.verificationStatus.toLowerCase() as 'pending' | 'passed' | 'failed')
        : null,
      createdAt: auction.createdAt.toISOString(),
      updatedAt: auction.updatedAt.toISOString(),
    };
  }

  async create(sellerId: string, dto: CreateListingDto) {
    this.assertMeetsMinimumPrice(dto.category, dto.startingPrice);
    this.assertValidSubcategoryTree(dto.category, dto.subCategory, dto.subSubCategory);

    const auction = await this.prisma.auction.create({
      data: {
        sellerId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        subCategory: dto.subCategory,
        subSubCategory: dto.subSubCategory,
        startingPrice: dto.startingPrice,
        durationHours: dto.durationHours,
        photos: dto.photos,
        sellerLocation: dto.sellerLocation,
        requestedStartTime: dto.requestedStartTime ? new Date(dto.requestedStartTime) : null,
        status: 'DRAFT',
      },
    });
    return this.toListingResponse(auction);
  }

  async findMine(sellerId: string) {
    const auctions = await this.prisma.auction.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
    return auctions.map((a: Auction) => this.toListingResponse(a));
  }

  /** Public browse — only ever shows what's actually live, per PRD (no path to Active skips verification). */
  async findActive(category?: AuctionCategory, page = 1, pageSize = 20) {
    const where = { status: 'ACTIVE' as const, ...(category ? { category } : {}) };
    const [items, total] = await Promise.all([
      this.prisma.auction.findMany({
        where,
        orderBy: { endTime: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.auction.count({ where }),
    ]);
    return { items: items.map((a: Auction) => this.toListingResponse(a)), total, page, pageSize };
  }

  /** Raw Prisma row — used internally by other modules (bidding, escrow, etc.) that need the real shape, not the frontend-facing one. */
  async findOneRaw(id: string): Promise<Auction> {
    const auction = await this.prisma.auction.findUnique({ where: { id } });
    if (!auction) throw new NotFoundException('Listing not found');
    return auction;
  }

  async findOne(id: string) {
    return this.toListingResponse(await this.findOneRaw(id));
  }

  async update(id: string, sellerId: string, dto: UpdateListingDto) {
    const auction = await this.findOneRaw(id);
    if (auction.sellerId !== sellerId) {
      throw new ForbiddenException('You do not own this listing');
    }
    if (!EDITABLE_STATUSES.includes(auction.status)) {
      throw new BadRequestException(
        `Listing cannot be edited once it is ${auction.status.toLowerCase()}`,
      );
    }

    const nextCategory = dto.category ?? auction.category;
    const nextPrice = dto.startingPrice ?? Number(auction.startingPrice);
    this.assertMeetsMinimumPrice(nextCategory, nextPrice);
    if (dto.subCategory || dto.subSubCategory) {
      this.assertValidSubcategoryTree(
        nextCategory,
        dto.subCategory ?? auction.subCategory ?? '',
        dto.subSubCategory ?? auction.subSubCategory ?? '',
      );
    }

    const updated = await this.prisma.auction.update({
      where: { id },
      data: {
        ...dto,
        requestedStartTime: dto.requestedStartTime ? new Date(dto.requestedStartTime) : undefined,
      },
    });
    return this.toListingResponse(updated);
  }

  /**
   * Starts the ₹49 verification-fee payment. In DEMO_MODE, by the time this
   * returns the payment has already auto-confirmed and the
   * VerificationRequest already exists (PaymentsService awaits the
   * confirmation event fully before returning — see its emitAsync usage) —
   * so the listing refetched here will already show `pending_verification`.
   * Outside DEMO_MODE it'll still show `draft`, accurately, until a real
   * payment actually completes. Either way this returns the frontend's
   * `Listing` shape (its listing.ts service expects one back), with the
   * Razorpay order details attached under `payment` rather than discarded —
   * needed for whenever real Checkout integration is added.
   */
  async requestVerification(id: string, sellerId: string) {
    const auction = await this.findOneRaw(id);
    if (auction.sellerId !== sellerId) {
      throw new ForbiddenException('You do not own this listing');
    }
    if (!SUBMITTABLE_STATUSES.includes(auction.status)) {
      throw new BadRequestException(
        `Listing must be a draft or a previously-rejected listing to request verification ` +
          `(currently ${auction.status.toLowerCase()})`,
      );
    }

    const payment = await this.paymentsService.createVerificationFeeOrder(auction.id, sellerId);
    const refreshed = await this.findOneRaw(id);

    return { ...this.toListingResponse(refreshed), payment };
  }
}
