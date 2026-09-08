import { useState } from "react";

import { ApiError } from "../../services/api/client";
import { authService } from "../../services/auth";
import type { ResetPasswordRequest } from "../../types/auth";

type ResetPasswordProps = {
  onBack: () => void;
};

type ResetStatus =
  | "idle"
  | "loading"
  | "success";

function ResetPassword({
  onBack,
}: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [status, setStatus] =
    useState<ResetStatus>("idle");

  const [error, setError] =
    useState<string | null>(null);

  const passwordsMatch =
    password === confirmPassword;

  const hasValidPassword =
    password.length >= 8;

  const canUpdate =
    hasValidPassword &&
    passwordsMatch &&
    !(
      status === "loading"
    );

  const resetToken =
    new URLSearchParams(
      window.location.search,
    ).get("token") ?? "";

  const handleUpdate = async () => {
    setError(null);

    if (!hasValidPassword) {
      setError(
        "Password must be at least 8 characters.",
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        "Confirm your password.",
      );
      return;
    }

    if (!passwordsMatch) {
      setError(
        "Passwords do not match.",
      );
      return;
    }

    if (!resetToken) {
      setError(
        "This password reset link is invalid or expired.",
      );
      return;
    }

    if (status === "loading") {
      return;
    }

    setStatus("loading");

    const payload: ResetPasswordRequest = {
      token: resetToken,
      password,
      confirmPassword,
    };

    try {
      await authService.resetPassword(
        payload,
      );

      setStatus("success");
    } catch (requestError) {
      if (
        requestError instanceof ApiError
      ) {
        setError(requestError.message);
      } else {
        setError(
          "Something went wrong. Please try again.",
        );
      }

      setStatus("idle");
    }
  };

  const isLoading =
    status === "loading";

  return (
    <main className="login">
      <div className="login-content">
        <div className="login-brand">
          ONBID
        </div>

        <div className="login-live">
          <span />
          ACCOUNT SECURITY
        </div>

        {status !== "success" ? (
          <>
            <div className="login-eyebrow">
              CREATE NEW PASSWORD
            </div>

            <h1>
              Reset
              <br />
              <em>password.</em>
            </h1>

            <p className="login-description">
              Create a new secure password
              for your OnBid account.
            </p>

            <div className="login-field">
              <label htmlFor="reset-password">
                New password
              </label>

              <input
                id="reset-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(event) => {
                  setPassword(
                    event.target.value,
                  );
                  setError(null);
                }}
                disabled={isLoading}
                aria-invalid={Boolean(error)}
              />
            </div>

            <div className="login-field">
              <label htmlFor="reset-confirm-password">
                Confirm password
              </label>

              <input
                id="reset-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value,
                  );
                  setError(null);
                }}
                disabled={isLoading}
                aria-invalid={Boolean(error)}
              />
            </div>

            {error && (
              <div
                className="password-error"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <button
              className="enter-button"
              type="button"
              onClick={handleUpdate}
              disabled={!canUpdate}
              aria-busy={isLoading}
            >
              <span>
                {isLoading
                  ? "Updating..."
                  : "Update Password"}
              </span>

              <strong>→</strong>
            </button>

            <button
              className="back-login"
              type="button"
              onClick={onBack}
              disabled={isLoading}
            >
              ← Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="login-eyebrow">
              PASSWORD UPDATED
            </div>

            <h1>
              You're
              <br />
              <em>all set.</em>
            </h1>

            <p className="login-description">
              Your password has been updated
              successfully. You can now log in
              with your new password.
            </p>

            <button
              className="enter-button"
              type="button"
              onClick={onBack}
            >
              <span>
                Back to Login
              </span>

              <strong>→</strong>
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default ResetPassword;