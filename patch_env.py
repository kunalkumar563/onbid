import re

with open('apps/api/.env', 'r') as f:
    content = f.read()

# Replace SendGrid block
old_sendgrid = '''SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@onbid.example
SENDGRID_FROM_NAME=Onbid'''

new_resend = '''RESEND_API_KEY=
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_FROM_NAME=Onbid'''

content = content.replace(old_sendgrid, new_resend)

with open('apps/api/.env', 'w') as f:
    f.write(content)

