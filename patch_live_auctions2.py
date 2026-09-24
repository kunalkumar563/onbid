import re

with open('apps/web/src/pages/dashboard/bidder/LiveAuctions.tsx', 'r') as f:
    content = f.read()

content = content.replace('Array.isArray(data) ? data : data?.data || []', 'Array.isArray(data) ? data : data?.items || data?.data || []')

with open('apps/web/src/pages/dashboard/bidder/LiveAuctions.tsx', 'w') as f:
    f.write(content)

