import re

with open('apps/web/src/pages/home/Home.css', 'r') as f:
    content = f.read()

old_nav_open = '''  .mobile-navigation.open {
    max-height: 750px;

    padding-top: 15px;
    padding-bottom: 18px;

    border-bottom-width: 1px;
  }'''

new_nav_open = '''  .mobile-navigation.open {
    max-height: calc(100vh - 65px);
    overflow-y: auto;

    padding-top: 15px;
    padding-bottom: 40px;

    border-bottom-width: 1px;
  }'''

content = content.replace(old_nav_open, new_nav_open)

with open('apps/web/src/pages/home/Home.css', 'w') as f:
    f.write(content)

