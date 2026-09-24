import re

with open('apps/web/src/components/dashboard/DashboardSidebar.tsx', 'r') as f:
    content = f.read()

content = content.replace('{ label: "Disputes", path: "/dashboard/bidder/disputes" },', '{ label: "KYC Verification", path: "/dashboard/bidder/kyc" },')

with open('apps/web/src/components/dashboard/DashboardSidebar.tsx', 'w') as f:
    f.write(content)

