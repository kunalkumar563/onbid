import re

with open('apps/web/src/pages/auctions/CategoryDashboard.css', 'r') as f:
    content = f.read()

content = content.replace('.category-hero-content h1 {\n    font-size: 36px;\n  }', '.category-hero-content h1 {\n    font-size: 26px;\n  }')

with open('apps/web/src/pages/auctions/CategoryDashboard.css', 'w') as f:
    f.write(content)
