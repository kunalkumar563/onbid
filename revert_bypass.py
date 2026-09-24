import re

with open('apps/web/src/pages/auth/ForgotPassword.tsx', 'r') as f:
    content = f.read()

# Revert ForgotPassword submit logic
old_submit = '''      const response = await authService.forgotPassword(payload);

      if (response && response.token) {
        window.location.assign(`/reset-password?token=${response.token}`);
      } else {
        setStatus("success");
      }
    } catch (requestError) {'''

new_submit = '''      await authService.forgotPassword(payload);
      setStatus("success");
    } catch (requestError) {'''

content = content.replace(old_submit, new_submit)

with open('apps/web/src/pages/auth/ForgotPassword.tsx', 'w') as f:
    f.write(content)

with open('apps/api/src/modules/notifications/email.service.ts', 'r') as f:
    content = f.read()

# Make email service log the body if skipped
old_log = '''      this.logger.debug(`(SendGrid not configured) would have emailed ${to}: ${subject}`);'''
new_log = '''      this.logger.debug(`(SendGrid not configured) would have emailed ${to}: ${subject}\\n${body}`);'''

content = content.replace(old_log, new_log)

with open('apps/api/src/modules/notifications/email.service.ts', 'w') as f:
    f.write(content)

