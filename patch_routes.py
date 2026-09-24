import re

with open('apps/web/src/routes/index.tsx', 'r') as f:
    content = f.read()

content = content.replace('import BidderDisputes from "../pages/dashboard/bidder/Disputes";', 'import BidderKYC from "../pages/dashboard/bidder/KYC";')
content = content.replace('{ path: "disputes", element: <BidderDisputes /> },', '{ path: "kyc", element: <BidderKYC /> },')

with open('apps/web/src/routes/index.tsx', 'w') as f:
    f.write(content)

