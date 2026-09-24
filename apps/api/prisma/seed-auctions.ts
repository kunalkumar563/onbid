import { PrismaClient, Role, AuctionCategory, AuctionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const seller = await prisma.user.upsert({
    where: { email: 'seller@onbid.com' },
    update: {},
    create: {
      email: 'seller@onbid.com',
      passwordHash: 'dummy_hash',
      fullName: 'Trusted Seller',
      dateOfBirth: new Date('1990-01-01'),
      kycStatus: 'VERIFIED',
      roles: [Role.BUYER, Role.SELLER],
    },
  });

  const now = new Date();
  const endsInOneHour = new Date(now.getTime() + 60 * 60 * 1000);
  const endsInFiveMins = new Date(now.getTime() + 5 * 60 * 1000);

  const auctions = [
    {
      title: 'Rolex Submariner 2024',
      description: 'Brand new, never worn. Box and papers included.',
      category: AuctionCategory.JEWELRY_WATCHES,
      subCategory: 'Watches',
      startingPrice: 1250000,
      currentBid: 0,
      durationHours: 24,
      status: AuctionStatus.ACTIVE,
      startTime: now,
      endTime: endsInOneHour,
      sellerLocation: 'Mumbai, Maharashtra, 400001',
      photos: ['/auctions/jewelry-01.png'],
      sellerId: seller.id,
    },
    {
      title: 'Sony Alpha A7 IV',
      description: 'Barely used mirrorless camera. Includes 24-70mm lens.',
      category: AuctionCategory.ELECTRONICS,
      subCategory: 'Cameras & Photography',
      startingPrice: 150000,
      currentBid: 160000,
      durationHours: 24,
      status: AuctionStatus.ACTIVE,
      startTime: now,
      endTime: endsInFiveMins,
      sellerLocation: 'Delhi, 110001',
      photos: ['/auctions/electronics-01.png'],
      sellerId: seller.id,
    },
    {
      title: 'Messi Signed Jersey',
      description: 'Authentic 2022 World Cup jersey signed by Lionel Messi. With COA.',
      category: AuctionCategory.SPORTS,
      subCategory: 'Memorabilia',
      startingPrice: 300000,
      currentBid: 0,
      durationHours: 72,
      status: AuctionStatus.ACTIVE,
      startTime: now,
      endTime: new Date(now.getTime() + 72 * 60 * 60 * 1000),
      sellerLocation: 'Bengaluru, Karnataka, 560001',
      photos: ['/auctions/sports-01.png'],
      sellerId: seller.id,
    }
  ];

  for (const auction of auctions) {
    const created = await prisma.auction.create({
      data: auction as any
    });
    console.log(`Created ACTIVE auction: ${created.title} (ID: ${created.id})`);
  }

  console.log('✅ Successfully seeded live auctions!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
