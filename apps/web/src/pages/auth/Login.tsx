import { useState } from "react";

import { authService } from "../../services/auth";
import { ApiError } from "../../services/api/client";
import type { LoginCredentials } from "../../types/auth";
import { useAuth } from "../../context/AuthContext";

type LoginPageProps = {
  onForgot: () => void;
  onSignup: () => void;
  onSuccess: () => void;
};

function LoginPage({
  onForgot,
  onSignup,
  onSuccess,
}: LoginPageProps) {
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const canSubmit =
    isValidEmail(email.trim()) &&
    password.length > 0 &&
    !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setError(null);
    setIsSubmitting(true);

    const credentials: LoginCredentials = {
      email: email.trim(),
      password,
      rememberMe,
    };

    try {
      await authService.login(credentials);

      await refreshUser();

      onSuccess();
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError(
          "Something went wrong. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login">
      <div className="login-content">
        <div className="login-brand"><img src="/auctions/onbid-logo.png" alt="ONBID" style={{ height: "70px", width: "100%", maxWidth: "250px", objectFit: "contain", marginBottom: "20px" }} /></div>

        <div className="login-live">
          <span />
          LIVE AUCTION
        </div>

        <div className="login-eyebrow">
          PREMIUM AUCTION PLATFORM
        </div>

        <h1>
          Welcome
          <br />
          <em>back.</em>
        </h1>

        <p className="login-description">
          Enter your details to discover,
          bid and win exceptional pieces.
        </p>

        <div className="login-field">
          <label htmlFor="login-email">
            Email address
          </label>

          <input
            id="login-email"
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
          />
        </div>

        <div className="login-field">
          <label htmlFor="login-password">
            Password
          </label>

          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(null);
            }}
            disabled={isSubmitting}
          />
        </div>

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(event.target.checked)
              }
              disabled={isSubmitting}
            />

            Remember me
          </label>

          <button
            type="button"
            onClick={onForgot}
            disabled={isSubmitting}
          >
            Forgot password?
          </button>
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
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-busy={isSubmitting}
        >
          <span>
            {isSubmitting
              ? "Signing in..."
              : "Enter Onbid"}
          </span>

          <strong>→</strong>
        </button>

        <div className="login-signup">
          <span>New to Onbid?</span>

          <button
            type="button"
            onClick={onSignup}
            disabled={isSubmitting}
          >
            Create an account
          </button>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;