import re

with open('apps/web/src/pages/auctions/AuctionList.tsx', 'r') as f:
    content = f.read()

content = content.replace('await api.get<Auction[]>(', 'await api.get<any>(')
content = content.replace('"/auctions",', '"/listings",')
content = content.replace('.data || [],', '.items || (response as any).data || [],')

with open('apps/web/src/pages/auctions/AuctionList.tsx', 'w') as f:
    f.write(content)

