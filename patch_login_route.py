import re

with open('apps/web/src/pages/auth/Login.tsx', 'r') as f:
    content = f.read()

# 1. Update Props
old_props = '''type LoginPageProps = {
  onForgot: () => void;
  onSignup: () => void;
};

function LoginPage({
  onForgot,
  onSignup,
}: LoginPageProps) {'''

new_props = '''type LoginPageProps = {
  onForgot: () => void;
  onSignup: () => void;
  onSuccess: () => void;
};

function LoginPage({
  onForgot,
  onSignup,
  onSuccess,
}: LoginPageProps) {'''

content = content.replace(old_props, new_props)

# 2. Update submit handler
old_submit = '''      await authService.login(credentials);

      await refreshUser();

      /*
       * LoginRoute owns navigation.
       * The authenticated user is now available
       * to DashboardRedirect.
       */
      window.location.assign("/dashboard");
    } catch (requestError) {'''

new_submit = '''      await authService.login(credentials);

      await refreshUser();

      onSuccess();
    } catch (requestError) {'''

content = content.replace(old_submit, new_submit)

with open('apps/web/src/pages/auth/Login.tsx', 'w') as f:
    f.write(content)

