import re

with open('apps/web/src/components/dashboard/DashboardSidebar.tsx', 'r') as f:
    content = f.read()

content = content.replace('    { label: "Messages", path: "/dashboard/bidder/messages" },\n', '')

with open('apps/web/src/components/dashboard/DashboardSidebar.tsx', 'w') as f:
    f.write(content)


with open('apps/web/src/routes/index.tsx', 'r') as f:
    routes = f.read()

routes = routes.replace('              { path: "messages", element: <BidderMessages /> },\n', '')
routes = routes.replace('import BidderMessages from "../pages/dashboard/bidder/Messages";\n', '')

with open('apps/web/src/routes/index.tsx', 'w') as f:
    f.write(routes)
