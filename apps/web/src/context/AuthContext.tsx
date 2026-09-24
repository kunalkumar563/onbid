import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authService } from "../services/auth";
import {
  hasAllPermissions as checkAllPermissions,
  hasAnyPermission as checkAnyPermissions,
  hasPermission as checkPermission,
  ROLE_PERMISSIONS,
} from "../config/permissions";

import type {
  AuthUser,
  Permission,
  UserRole,
} from "../types/auth";

type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  role: UserRole | null;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  refreshUser: () => Promise<void>;
  clearSession: () => void;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = { children: ReactNode; };

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshUser = async () => {
    const savedRole = (localStorage.getItem("onbid_demo_role") as UserRole) || "bidder";
    setUser({
      id: "dummy-user-123",
      fullName: "Test User",
      email: "test@example.com",
      role: savedRole,
    });
    setStatus("authenticated");
  };

  const switchRole = (newRole: UserRole) => {
    localStorage.setItem("onbid_demo_role", newRole);
    setUser(prev => prev ? { ...prev, role: newRole } : null);
    window.location.href = "/dashboard";
  };

  const clearSession = () => {
    setUser(null);
    setStatus("unauthenticated");
  };

  const logout = async () => {
    clearSession();
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const role = user?.role ?? null;
  const permissions = user?.permissions ?? (role ? ROLE_PERMISSIONS[role] : []);

  const permissionChecker = useMemo(() => ({
    hasPermission: (permission: Permission) => role ? checkPermission(role, permission) : false,
    hasAnyPermission: (requiredPermissions: Permission[]) => role ? checkAnyPermissions(role, requiredPermissions) : false,
    hasAllPermissions: (requiredPermissions: Permission[]) => role ? checkAllPermissions(role, requiredPermissions) : false,
  }), [role]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user, status, isAuthenticated: status === "authenticated",
      role, permissions,
      hasPermission: permissionChecker.hasPermission,
      hasAnyPermission: permissionChecker.hasAnyPermission,
      hasAllPermissions: permissionChecker.hasAllPermissions,
      refreshUser, clearSession, logout, switchRole,
    }),
    [user, status, role, permissions, permissionChecker]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
