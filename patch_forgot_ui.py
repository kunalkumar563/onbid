import re

with open('apps/web/src/pages/auth/ForgotPassword.tsx', 'r') as f:
    content = f.read()

old_submit = '''      await authService.forgotPassword(payload);

      setStatus("success");
    } catch (requestError) {'''

new_submit = '''      const response = await authService.forgotPassword(payload);

      if (response && response.token) {
        window.location.assign(`/reset-password?token=${response.token}`);
      } else {
        setStatus("success");
      }
    } catch (requestError) {'''

content = content.replace(old_submit, new_submit)

with open('apps/web/src/pages/auth/ForgotPassword.tsx', 'w') as f:
    f.write(content)

