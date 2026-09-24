import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { AuctionCategory, VerificationRequestStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * PRD §4.9: "workload by area, pass/fail rate, turnaround time" — computed
   * live from VerificationRequest rows rather than maintained as a running
   * counter, so it can never drift out of sync with the actual data.
   */
  async listVerifiers() {
    const verifiers = await this.prisma.verifier.findMany({
      include: { user: { select: { fullName: true, email: true } } },
    });

    return Promise.all(
      verifiers.map(
        async (verifier: {
          id: string;
          coverageArea: string;
          active: boolean;
          user: { fullName: string; email: string };
        }) => {
          const [activeCount, completed] = await Promise.all([
            this.prisma.verificationRequest.count({
              where: { verifierId: verifier.id, status: { in: ['PENDING', 'SCHEDULED'] } },
            }),
            this.prisma.verificationRequest.findMany({
              where: { verifierId: verifier.id, status: { in: ['PASSED', 'FAILED'] } },
              select: { status: true, scheduledAt: true, completedAt: true },
            }),
          ]);

          const passed = completed.filter((r: { status: string }) => r.status === 'PASSED').length;
          const total = completed.length;

          const turnaroundSamples = completed
            .filter(
              (r: { scheduledAt: Date | null; completedAt: Date | null }) =>
                r.scheduledAt && r.completedAt,
            )
            .map(
              (r: { scheduledAt: Date | null; completedAt: Date | null }) =>
                (r.completedAt!.getTime() - r.scheduledAt!.getTime()) / (60 * 60 * 1000),
            );
          const avgTurnaroundHours =
            turnaroundSamples.length > 0
              ? turnaroundSamples.reduce((a: number, b: number) => a + b, 0) /
                turnaroundSamples.length
              : null;

          return {
            id: verifier.id,
            name: verifier.user.fullName,
            email: verifier.user.email,
            coverageArea: verifier.coverageArea,
            active: verifier.active,
            currentWorkload: activeCount,
            completedCount: total,
            passRate: total > 0 ? passed / total : null,
            avgTurnaroundHours,
          };
        },
      ),
    );
  }

  /** Cross-verifier queue view — PRD §4.9: "filterable by category and location." */
  async getVerificationQueue(filters: {
    status?: VerificationRequestStatus;
    category?: AuctionCategory;
    location?: string;
  }) {
    return this.prisma.verificationRequest.findMany({
      where: {
        status: filters.status,
        listing: {
          category: filters.category,
          sellerLocation: filters.location,
        },
      },
      include: {
        listing: { select: { title: true, category: true, sellerLocation: true } },
        verifier: { include: { user: { select: { fullName: true } } } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
