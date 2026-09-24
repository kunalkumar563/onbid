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
    return api.post<AuthResponse, RegisterCredentials>(
      "/auth/register",
      credentials,
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
    return api.post<import("../types/auth").AuthResponse, ResetPasswordRequest>(
      "/auth/reset-password",
      payload,
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