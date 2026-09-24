import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.updateMany({
    data: { kycStatus: 'VERIFIED' }
  });
  console.log('All users verified!');
}
main().finally(() => prisma.$disconnect());
