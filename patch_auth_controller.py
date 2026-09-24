import re

with open('apps/api/src/modules/auth/auth.controller.ts', 'r') as f:
    content = f.read()

# 1. Update resetPassword to set cookies and return result
old_reset = '''  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }'''

new_reset = '''  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.resetPassword(dto.token, dto.newPassword);
    this.setAuthCookies(res, result.tokens);
    return result;
  }'''

content = content.replace(old_reset, new_reset)

with open('apps/api/src/modules/auth/auth.controller.ts', 'w') as f:
    f.write(content)

