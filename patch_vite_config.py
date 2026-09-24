import re
with open('apps/web/vite.config.js', 'r') as f:
    content = f.read()

content = content.replace('"http://localhost:3000"', '"http://127.0.0.1:3000"')

with open('apps/web/vite.config.js', 'w') as f:
    f.write(content)
