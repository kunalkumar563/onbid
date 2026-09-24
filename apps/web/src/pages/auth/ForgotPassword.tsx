import { useState } from "react";

import { ApiError } from "../../services/api/client";
import { authService } from "../../services/auth";
import type { ForgotPasswordRequest } from "../../types/auth";

type ForgotPasswordProps = {
  onBack: () => void;
  onReset: () => void;
};

type SubmitStatus = "idle" | "loading" | "success";

function ForgotPassword({
  onBack,
  onReset,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] =
    useState<SubmitStatus>("idle");
  const [error, setError] =
    useState<string | null>(null);

  const normalizedEmail = email.trim();

  const isValidEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalizedEmail,
    );

  const isSubmitting = status === "loading";

  const canSubmit =
    isValidEmail && !isSubmitting;

  const handleSendReset = async () => {
    if (!canSubmit) {
      if (!normalizedEmail) {
        setError("Enter your email address.");
      } else if (!isValidEmail) {
        setError("Enter a valid email address.");
      }

      return;
    }

    setError(null);
    setStatus("loading");

    const payload: ForgotPasswordRequest = {
      email: normalizedEmail,
    };

    try {
      await authService.forgotPassword(payload);

      setStatus("success");
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError(
          "Something went wrong. Please try again.",
        );
      }

      setStatus("idle");
    }
  };

  return (
    <main className="login">
      <div className="login-content">
        <div className="login-brand"><img src="/auctions/onbid-logo.png" alt="ONBID" style={{ height: "70px", width: "100%", maxWidth: "250px", objectFit: "contain", marginBottom: "20px" }} /></div>

        <div className="login-live">
          <span />
          ACCOUNT SECURITY
        </div>

        {status !== "success" ? (
          <>
            <div className="login-eyebrow">
              PASSWORD RECOVERY
            </div>

            <h1>
              Forgot
              <br />
              <em>password?</em>
            </h1>

            <p className="login-description">
              Enter the email address associated
              with your OnBid account and we'll
              send you a secure reset link.
            </p>

            <div className="login-field">
              <label htmlFor="forgot-email">
                Email address
              </label>

              <input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                disabled={isSubmitting}
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error
                    ? "forgot-email-error"
                    : undefined
                }
              />
            </div>

            {error && (
              <div
                id="forgot-email-error"
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
              onClick={handleSendReset}
              disabled={!canSubmit}
              aria-busy={isSubmitting}
            >
              <span>
                {isSubmitting
                  ? "Sending..."
                  : "Send Reset Link"}
              </span>

              <strong>→</strong>
            </button>

            <button
              className="back-login"
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
            >
              ← Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="login-eyebrow">
              EMAIL SENT
            </div>

            <h1>
              Check your
              <br />
              <em>inbox.</em>
            </h1>

            <p className="login-description">
              We've sent a password reset link
              to your email address.
            </p>

            <div className="reset-success">
              <span>✓</span>

              <div>
                <strong>
                  Reset link sent
                </strong>

                <p>
                  Check your inbox and follow
                  the secure reset instructions.
                </p>
              </div>
            </div>

            <button
              className="enter-button"
              type="button"
              onClick={onReset}
            >
              <span>
                Continue to Reset Password
              </span>

              <strong>→</strong>
            </button>

            <button
              className="back-login"
              type="button"
              onClick={onBack}
            >
              ← Back to Login
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default ForgotPassword;