import re

with open('apps/web/src/services/auth.ts', 'r') as f:
    content = f.read()

# Update register
old_register = '''  register(
    credentials: RegisterCredentials,
  ): Promise<AuthResponse> {
    return api.post<AuthResponse, RegisterCredentials>(
      "/auth/register",
      credentials,
    );
  }'''

new_register = '''  register(
    credentials: RegisterCredentials,
  ): Promise<AuthResponse> {
    const { confirmPassword, ...rest } = credentials;
    return api.post<AuthResponse, any>(
      "/auth/register",
      rest,
    );
  }'''

content = content.replace(old_register, new_register)

# Update resetPassword
old_reset = '''  resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<import("../types/auth").AuthResponse> {
    return api.post<import("../types/auth").AuthResponse, ResetPasswordRequest>(
      "/auth/reset-password",
      payload,
    );
  }'''

new_reset = '''  resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<import("../types/auth").AuthResponse> {
    const { confirmPassword, ...rest } = payload;
    return api.post<import("../types/auth").AuthResponse, any>(
      "/auth/reset-password",
      rest,
    );
  }'''

content = content.replace(old_reset, new_reset)

with open('apps/web/src/services/auth.ts', 'w') as f:
    f.write(content)

