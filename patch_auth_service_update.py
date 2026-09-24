import re

with open('apps/api/src/modules/auth/auth.service.ts', 'r') as f:
    content = f.read()

old_logic = """  async updateProfile(userId: string, data: any) {
    // Only allow updating certain fields
    const { firstName, lastName, phone, dateOfBirth, address } = data;
    
    // Address comes in as an object from the frontend but we need to stringify or store it. 
    // Prisma schema might not have an 'address' field on User! Let's check schema first.
    // Wait, let's just use prisma.user.update
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(dateOfBirth !== undefined && { dateOfBirth: new Date(dateOfBirth) }),
        // ... assuming address doesn't exist yet, we might skip it or store it in a JSON field if it exists.
      }
    });
    return this.toAuthResponse(updated);
  }"""

new_logic = """  async updateProfile(userId: string, data: any) {
    // Only allow updating certain fields
    const { fullName, phone, dateOfBirth } = data;
    
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(dateOfBirth !== undefined && dateOfBirth !== '' && { dateOfBirth: new Date(dateOfBirth) })
      }
    });
    return this.toAuthResponse(updated);
  }"""

content = content.replace(old_logic, new_logic)

with open('apps/api/src/modules/auth/auth.service.ts', 'w') as f:
    f.write(content)

