import re

with open('apps/api/src/modules/auth/auth.service.ts', 'r') as f:
    content = f.read()

# 1. Update forgotPassword return
old_forgot = """    await this.emailService.send(
      user.email,
      'Reset your Onbid password',
      `We received a request to reset your Onbid password. This link expires in 1 hour:\\n\\n${resetLink}\\n\\nIf you didn't request this, you can ignore this email.`,
    );
  }"""
new_forgot = """    await this.emailService.send(
      user.email,
      'Reset your Onbid password',
      `We received a request to reset your Onbid password. This link expires in 1 hour:\\n\\n${resetLink}\\n\\nIf you didn't request this, you can ignore this email.`,
    );
    return { token: rawToken };
  }"""
content = content.replace(old_forgot, new_forgot)

# 2. Update resetPassword return
old_reset = """    // Standard practice after any password change: kill every existing
    // session so a stolen-but-not-yet-used old token can't outlive the
    // password that granted it.
    await this.refreshTokens.revokeAllForUser(user.id);
  }"""
new_reset = """    // Standard practice after any password change: kill every existing
    // session so a stolen-but-not-yet-used old token can't outlive the
    // password that granted it.
    await this.refreshTokens.revokeAllForUser(user.id);

    const updatedUser = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!updatedUser) throw new BadRequestException();
    const tokens = await this.issueTokens(updatedUser);
    return { user: this.toPublicUser(updatedUser), tokens };
  }"""
content = content.replace(old_reset, new_reset)

with open('apps/api/src/modules/auth/auth.service.ts', 'w') as f:
    f.write(content)

