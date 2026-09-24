import re

# 1. Update auth.ts service
with open('apps/web/src/services/auth.ts', 'r') as f:
    content = f.read()

# Change getCurrentUser return type
content = content.replace('getCurrentUser(): Promise<AuthResponse>', 'getCurrentUser(): Promise<import("../types/auth").AuthUser>')
content = content.replace('api.get<AuthResponse>("/auth/me")', 'api.get<import("../types/auth").AuthUser>("/auth/me")')

with open('apps/web/src/services/auth.ts', 'w') as f:
    f.write(content)


# 2. Update AuthContext.tsx
with open('apps/web/src/context/AuthContext.tsx', 'r') as f:
    content = f.read()

old_refresh = '''  const refreshUser = async () => {
    const savedRole = (localStorage.getItem("onbid_demo_role") as UserRole) || "bidder";
    setUser({
      id: "dummy-user-123",
      fullName: "Test User",
      email: "test@example.com",
      role: savedRole,
    });
    setStatus("authenticated");
  };'''

new_refresh = '''  const refreshUser = async () => {
    try {
      // API call to the actual backend
      const user = await authService.getCurrentUser();
      setUser(user);
      setStatus("authenticated");
    } catch (error) {
      // Fallback for Vercel preview/demo mode if backend is not available
      if (import.meta.env.VITE_PREVIEW_MODE === "true") {
        console.warn("Backend unavailable, using Demo Mode fallback.");
        const savedRole = (localStorage.getItem("onbid_demo_role") as UserRole) || "bidder";
        setUser({
          id: "dummy-user-123",
          fullName: "Demo User",
          email: "demo@example.com",
          role: savedRole,
        });
        setStatus("authenticated");
      } else {
        clearSession();
      }
    }
  };'''

content = content.replace(old_refresh, new_refresh)

old_logout = '''  const logout = async () => {
    clearSession();
  };'''

new_logout = '''  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore logout errors
    } finally {
      clearSession();
    }
  };'''

content = content.replace(old_logout, new_logout)

with open('apps/web/src/context/AuthContext.tsx', 'w') as f:
    f.write(content)

