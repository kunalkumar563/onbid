import re

with open('apps/web/src/pages/auth/Signup.tsx', 'r') as f:
    content = f.read()

content = content.replace('navigate("/"), { replace: true });', 'navigate("/", { replace: true });')

with open('apps/web/src/pages/auth/Signup.tsx', 'w') as f:
    f.write(content)

with open('apps/web/src/pages/auth/ResetPassword.tsx', 'r') as f:
    content = f.read()

content = content.replace('navigate("/"), { replace: true });', 'navigate("/", { replace: true });')

with open('apps/web/src/pages/auth/ResetPassword.tsx', 'w') as f:
    f.write(content)

