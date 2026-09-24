import re

with open('apps/api/src/modules/bidding/bidding.controller.ts', 'r') as f:
    content = f.read()

new_endpoints = """  @UseGuards(JwtAuthGuard)
  @Get('my/history')
  getMyBids(@CurrentUser() user: AuthenticatedUser) {
    return this.biddingService.getMyBids(user.id);
  }

  @Get(':id')"""

content = content.replace('  @Get(\':id\')', new_endpoints, 1)

with open('apps/api/src/modules/bidding/bidding.controller.ts', 'w') as f:
    f.write(content)


with open('apps/api/src/modules/bidding/bidding.service.ts', 'r') as f:
    service_content = f.read()

new_method = """  async getMyBids(userId: string) {
    const auctions = await this.prisma.auction.findMany({
      where: {
        bids: { some: { bidderId: userId } }
      },
      include: {
        bids: { 
          where: { bidderId: userId }, 
          orderBy: { amount: 'desc' }, 
          take: 1 
        }
      },
      orderBy: { endTime: 'asc' }
    });

    return auctions.map(a => ({
      auction: a,
      myHighestBid: a.bids[0]?.amount || 0,
      isWinning: a.currentBidderId === userId
    }));
  }

  async placeBid"""

service_content = service_content.replace('  async placeBid', new_method, 1)

with open('apps/api/src/modules/bidding/bidding.service.ts', 'w') as f:
    f.write(service_content)

