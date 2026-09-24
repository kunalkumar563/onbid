import re

with open('apps/api/src/modules/auth/auth.service.ts', 'r') as f:
    content = f.read()

# 1. Update forgotPassword return type
content = content.replace('forgotPassword(email: string): Promise<void> {', 'forgotPassword(email: string): Promise<{token?: string}> {')
content = content.replace('if (!user) return;', 'if (!user) return {};')

# Update the end of forgotPassword
old_end = '''    await this.emailService.send(
      user.email,
      'Reset your Onbid password',
      `Click here to reset your password: ${resetLink}\\n\\nThis link expires in 15 minutes.`,
    );
  }'''

new_end = '''    await this.emailService.send(
      user.email,
      'Reset your Onbid password',
      `Click here to reset your password: ${resetLink}\\n\\nThis link expires in 15 minutes.`,
    );
    
    // For local testing convenience since we don't have emails setup
    return { token: rawToken };
  }'''

content = content.replace(old_end, new_end)


# 2. Update resetPassword to return tokens
old_reset = '''  async resetPassword(rawToken: string, newPassword: string): Promise<void> {'''
new_reset = '''  async resetPassword(rawToken: string, newPassword: string): Promise<{ user: PublicUser; tokens: AuthTokens }> {'''
content = content.replace(old_reset, new_reset)

old_reset_end = '''    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });
  }'''

new_reset_end = '''    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });
    
    const tokens = await this.issueTokens(updatedUser);
    return { user: this.toPublicUser(updatedUser), tokens };
  }'''

content = content.replace(old_reset_end, new_reset_end)

with open('apps/api/src/modules/auth/auth.service.ts', 'w') as f:
    f.write(content)

