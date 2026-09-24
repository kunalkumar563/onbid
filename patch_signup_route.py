import re

with open('apps/web/src/pages/auth/Signup.tsx', 'r') as f:
    content = f.read()

if 'import { useNavigate }' not in content:
    content = content.replace('import { useAuth }', 'import { useNavigate } from "react-router-dom";\nimport { useAuth }')

if 'const navigate = useNavigate();' not in content:
    content = content.replace('const { refreshUser } = useAuth();', 'const { refreshUser } = useAuth();\n  const navigate = useNavigate();')

content = content.replace('window.location.assign("/dashboard");', 'navigate("/dashboard", { replace: true });')

with open('apps/web/src/pages/auth/Signup.tsx', 'w') as f:
    f.write(content)


with open('apps/web/src/pages/auth/ResetPassword.tsx', 'r') as f:
    content = f.read()

if 'import { useNavigate }' not in content:
    content = content.replace('import { useAuth }', 'import { useNavigate } from "react-router-dom";\nimport { useAuth }')

if 'const navigate = useNavigate();' not in content:
    content = content.replace('const { refreshUser } = useAuth();', 'const { refreshUser } = useAuth();\n  const navigate = useNavigate();')

content = content.replace('window.location.assign("/dashboard");', 'navigate("/dashboard", { replace: true });')

with open('apps/web/src/pages/auth/ResetPassword.tsx', 'w') as f:
    f.write(content)

