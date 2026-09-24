import re

with open('apps/web/src/pages/auth/ForgotPassword.tsx', 'r') as f:
    content = f.read()

old_btn = '''            <button
              className="enter-button"
              type="button"
              onClick={onReset}
            >
              <span>
                Continue to Reset Password
              </span>

              <strong>→</strong>
            </button>'''

content = content.replace(old_btn, '')

with open('apps/web/src/pages/auth/ForgotPassword.tsx', 'w') as f:
    f.write(content)

