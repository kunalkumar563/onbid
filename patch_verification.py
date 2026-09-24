import re

with open('apps/api/src/modules/verification/verification.service.ts', 'r') as f:
    content = f.read()

# Add import
if "import { Role } from '@prisma/client';" not in content:
    content = "import { Role } from '@prisma/client';\n" + content

# Fix roles string issue
old_line = "const roles = user.roles.includes('VERIFIER') ? user.roles : [...user.roles, 'VERIFIER'];"
new_line = "const roles = user.roles.includes(Role.VERIFIER) ? user.roles : [...user.roles, Role.VERIFIER];"

content = content.replace(old_line, new_line)

with open('apps/api/src/modules/verification/verification.service.ts', 'w') as f:
    f.write(content)
