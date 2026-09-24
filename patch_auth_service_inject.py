with open('apps/api/src/modules/auth/auth.service.ts', 'r') as f:
    content = f.read()

new_method = """  async updateProfile(userId: string, data: any): Promise<PublicUser> {
    const { fullName, phone, dateOfBirth } = data;
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(dateOfBirth !== undefined && dateOfBirth !== '' && { dateOfBirth: new Date(dateOfBirth) })
      }
    });
    return this.toPublicUser(user);
  }
}"""

content = content.replace("  }\n}", "  }\n\n" + new_method)

with open('apps/api/src/modules/auth/auth.service.ts', 'w') as f:
    f.write(content)

