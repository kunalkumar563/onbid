import re

with open('apps/api/src/modules/bidding/bidding.service.ts', 'r') as f:
    content = f.read()

old_method = """  async getMyBids(userId: string) {
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
  }"""

new_method = """  async getMyBids(userId: string) {
    const allBids = await this.prisma.bid.findMany({
      where: { bidderId: userId },
      include: { auction: true },
      orderBy: { createdAt: 'desc' }
    });

    return allBids.map(bid => {
      // A specific bid is the "winning" bid ONLY IF the auction's current bid exactly matches this bid's amount
      // AND the current highest bidder is this user.
      const isWinningBid = 
        bid.auction.currentBidderId === userId && 
        Number(bid.auction.currentBid) === Number(bid.amount);
      
      return {
        id: bid.id, // unique ID for this specific bid
        auction: bid.auction,
        myBidAmount: bid.amount,
        createdAt: bid.createdAt,
        isWinning: isWinningBid
      };
    });
  }"""

content = content.replace(old_method, new_method)

with open('apps/api/src/modules/bidding/bidding.service.ts', 'w') as f:
    f.write(content)

