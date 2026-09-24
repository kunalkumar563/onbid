import re

with open('apps/web/src/pages/auth/Signup.tsx', 'r') as f:
    content = f.read()

# 1. Add useAuth import
if 'import { useAuth } from "../../context/AuthContext";' not in content:
    content = content.replace('import { authService }', 'import { useAuth } from "../../context/AuthContext";\nimport { authService }')

# 2. Add refreshUser to component
if 'const { refreshUser } = useAuth();' not in content:
    content = content.replace('const [status, setStatus] =', 'const { refreshUser } = useAuth();\n  const [status, setStatus] =')

# 3. Update the handleSubmit function to redirect instead of setting success status
old_submit = '''      await authService.register(payload);

      setStatus("success");
    } catch (error) {'''

new_submit = '''      await authService.register(payload);
      await refreshUser();
      window.location.assign("/dashboard");
    } catch (error) {'''

content = content.replace(old_submit, new_submit)

with open('apps/web/src/pages/auth/Signup.tsx', 'w') as f:
    f.write(content)

