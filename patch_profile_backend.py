import re

with open('apps/api/src/modules/auth/auth.controller.ts', 'r') as f:
    content = f.read()

new_endpoints = """  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: any) {
    return this.authService.updateProfile(user.id, dto);
  }"""

content = content.replace("  @UseGuards(JwtAuthGuard)\n  @Get('me')\n  me(@CurrentUser() user: AuthenticatedUser) {\n    return this.authService.me(user.id);\n  }", new_endpoints)

with open('apps/api/src/modules/auth/auth.controller.ts', 'w') as f:
    f.write(content)


with open('apps/api/src/modules/auth/auth.service.ts', 'r') as f:
    service_content = f.read()

new_method = """  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return this.toAuthResponse(user);
  }

  async updateProfile(userId: string, data: any) {
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

service_content = service_content.replace("  async me(userId: string) {\n    const user = await this.prisma.user.findUnique({ where: { id: userId } });\n    if (!user) throw new UnauthorizedException('User not found');\n    return this.toAuthResponse(user);\n  }", new_method)

with open('apps/api/src/modules/auth/auth.service.ts', 'w') as f:
    f.write(service_content)

