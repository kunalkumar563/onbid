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

  hasPermission: (
    permission: Permission,
  ) => boolean;

  hasAnyPermission: (
    permissions: Permission[],
  ) => boolean;

  hasAllPermissions: (
    permissions: Permission[],
  ) => boolean;

  refreshUser: () => Promise<void>;
  clearSession: () => void;
  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [status, setStatus] =
    useState<AuthStatus>("loading");

  const refreshUser = async () => {
    try {
      setStatus("loading");

      const response =
        await authService.getCurrentUser();

      setUser(response.user);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  };

  const clearSession = () => {
    setUser(null);
    setStatus("unauthenticated");
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const role =
    user?.role ?? null;

  /*
   * Backend permissions take priority.
   * If backend doesn't send permissions,
   * use the application's role-permission map.
   */
  const permissions =
    user?.permissions ??
    (role
      ? ROLE_PERMISSIONS[role]
      : []);

  const permissionChecker = useMemo(
    () => ({
      hasPermission: (
        permission: Permission,
      ) =>
        role
          ? checkPermission(
              role,
              permission,
            )
          : false,

      hasAnyPermission: (
        requiredPermissions: Permission[],
      ) =>
        role
          ? checkAnyPermissions(
              role,
              requiredPermissions,
            )
          : false,

      hasAllPermissions: (
        requiredPermissions: Permission[],
      ) =>
        role
          ? checkAllPermissions(
              role,
              requiredPermissions,
            )
          : false,
    }),
    [role],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,

      isAuthenticated:
        status === "authenticated",

      role,
      permissions,

      hasPermission:
        permissionChecker.hasPermission,

      hasAnyPermission:
        permissionChecker.hasAnyPermission,

      hasAllPermissions:
        permissionChecker.hasAllPermissions,

      refreshUser,
      clearSession,
      logout,
    }),
    [
      user,
      status,
      role,
      permissions,
      permissionChecker,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}