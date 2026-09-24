import re

with open('apps/api/src/config/configuration.ts', 'r') as f:
    content = f.read()

old_sendgrid = '''    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@onbid.example',
      fromName: process.env.SENDGRID_FROM_NAME || 'Onbid',
    },'''

new_resend = '''    resend: {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      fromName: process.env.RESEND_FROM_NAME || 'Onbid',
    },'''

content = content.replace(old_sendgrid, new_resend)

with open('apps/api/src/config/configuration.ts', 'w') as f:
    f.write(content)

