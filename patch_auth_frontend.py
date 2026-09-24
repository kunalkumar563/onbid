import re

with open('apps/web/src/services/auth.ts', 'r') as f:
    content = f.read()

# Update forgotPassword
content = content.replace('forgotPassword(\n    payload: ForgotPasswordRequest,\n  ): Promise<void> {', 'forgotPassword(\n    payload: ForgotPasswordRequest,\n  ): Promise<{token?: string}> {')
content = content.replace('api.post<void, ForgotPasswordRequest>', 'api.post<{token?: string}, ForgotPasswordRequest>')

# Update resetPassword
content = content.replace('resetPassword(\n    payload: ResetPasswordRequest,\n  ): Promise<void> {', 'resetPassword(\n    payload: ResetPasswordRequest,\n  ): Promise<import("../types/auth").AuthResponse> {')
content = content.replace('api.post<void, ResetPasswordRequest>', 'api.post<import("../types/auth").AuthResponse, ResetPasswordRequest>')

with open('apps/web/src/services/auth.ts', 'w') as f:
    f.write(content)

