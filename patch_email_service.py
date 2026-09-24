import re

with open('apps/api/src/modules/notifications/email.service.ts', 'r') as f:
    content = f.read()

old_send = '''    try {
      await this.resendClient.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to,
        subject,
        text: body,
      });
      this.logger.log(`Email successfully sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
    }'''

new_send = '''    try {
      const { data, error } = await this.resendClient.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to,
        subject,
        text: body,
      });
      
      if (error) {
        this.logger.error(`Resend API Error: ${error.message}`, error);
        // Fallback for dev: print the link so you can still test it
        this.logger.debug(`Could not email ${to}. Email content:\\n${body}`);
        return;
      }
      
      this.logger.log(`Email successfully sent to ${to} (ID: ${data?.id})`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      this.logger.debug(`Could not email ${to}. Email content:\\n${body}`);
    }'''

content = content.replace(old_send, new_send)

with open('apps/api/src/modules/notifications/email.service.ts', 'w') as f:
    f.write(content)

