import { api } from "./api/client";

import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
} from "../types/auth";

export const authService = {
  login(
    credentials: LoginCredentials,
  ): Promise<AuthResponse> {
    return api.post<AuthResponse, LoginCredentials>(
      "/auth/login",
      credentials,
    );
  },

  register(
    credentials: RegisterCredentials,
  ): Promise<AuthResponse> {
    const { confirmPassword, ...rest } = credentials;
    return api.post<AuthResponse, any>(
      "/auth/register",
      rest,
    );
  },

  forgotPassword(
    payload: ForgotPasswordRequest,
  ): Promise<{token?: string}> {
    return api.post<{token?: string}, ForgotPasswordRequest>(
      "/auth/forgot-password",
      payload,
    );
  },

  resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<import("../types/auth").AuthResponse> {
    const { confirmPassword, ...rest } = payload;
    return api.post<import("../types/auth").AuthResponse, any>(
      "/auth/reset-password",
      rest,
    );
  },

  logout(): Promise<void> {
    return api.post<void, Record<string, never>>(
      "/auth/logout",
      {},
    );
  },

  getCurrentUser(): Promise<import("../types/auth").AuthUser> {
    return api.get<import("../types/auth").AuthUser>("/auth/me");
  },
};