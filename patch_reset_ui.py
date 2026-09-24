import re

with open('apps/web/src/pages/auth/ResetPassword.tsx', 'r') as f:
    content = f.read()

# Import useAuth
if 'import { useAuth }' not in content:
    content = content.replace('import { authService }', 'import { useAuth } from "../../context/AuthContext";\nimport { authService }')

# Extract refreshUser
if 'const { refreshUser } = useAuth();' not in content:
    content = content.replace('const [password, setPassword] =', 'const { refreshUser } = useAuth();\n  const [password, setPassword] =')

# Update submit logic
old_submit = '''      await authService.resetPassword(
        payload,
      );

      setStatus("success");
    } catch (requestError) {'''

new_submit = '''      await authService.resetPassword(payload);
      
      await refreshUser();
      window.location.assign("/dashboard");
    } catch (requestError) {'''

content = content.replace(old_submit, new_submit)

with open('apps/web/src/pages/auth/ResetPassword.tsx', 'w') as f:
    f.write(content)

