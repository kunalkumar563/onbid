import re

with open('apps/web/src/services/auth.ts', 'r') as f:
    content = f.read()

old_login = '''  login(
    credentials: LoginCredentials,
  ): Promise<AuthResponse> {
    return api.post<AuthResponse, LoginCredentials>(
      "/auth/login",
      credentials,
    );
  },'''

new_login = '''  login(
    credentials: LoginCredentials,
  ): Promise<AuthResponse> {
    const { rememberMe, ...rest } = credentials;
    return api.post<AuthResponse, any>(
      "/auth/login",
      rest,
    );
  },'''

content = content.replace(old_login, new_login)

with open('apps/web/src/services/auth.ts', 'w') as f:
    f.write(content)

