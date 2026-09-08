import { useMemo, useState } from "react";

import { authService } from "../../services/auth";
import { ApiError } from "../../services/api/client";
import type { RegisterCredentials } from "../../types/auth";

type SignupProps = {
  onBack: () => void;
};

type SignupForm = RegisterCredentials & {
  acceptTerms: boolean;
};

type SignupErrors = Partial<
  Record<keyof SignupForm, string>
>;

type SignupStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

const initialForm: SignupForm = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

function getPasswordStrength(password: string): {
  score: number;
  label: string;
} {
  if (!password) {
    return {
      score: 0,
      label: "",
    };
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels: Record<number, string> = {
    1: "Very weak",
    2: "Weak",
    3: "Fair",
    4: "Strong",
    5: "Very strong",
  };

  return {
    score,
    label: labels[score] ?? "",
  };
}

function Signup({ onBack }: SignupProps) {
  const [form, setForm] =
    useState<SignupForm>(initialForm);

  const [errors, setErrors] =
    useState<SignupErrors>({});

  const [status, setStatus] =
    useState<SignupStatus>("idle");

  const [serverError, setServerError] =
    useState<string | null>(null);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password],
  );

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    const fieldName =
      name as keyof SignupForm;

    const nextValue =
      type === "checkbox"
        ? checked
        : value;

    setForm((current) => ({
      ...current,
      [fieldName]: nextValue,
    }));

    setErrors((current) => {
      if (!current[fieldName]) {
        return current;
      }

      const next = {
        ...current,
      };

      delete next[fieldName];

      return next;
    });

    setServerError(null);

    if (status !== "idle") {
      setStatus("idle");
    }
  }

  function validate(): SignupErrors {
    const nextErrors: SignupErrors = {};

    const name = form.fullName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name) {
      nextErrors.fullName =
        "Enter your full name.";
    } else if (name.length < 2) {
      nextErrors.fullName =
        "Name must contain at least 2 characters.";
    }

    if (!email) {
      nextErrors.email =
        "Enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!phone) {
      nextErrors.phone =
        "Enter your phone number.";
    } else if (
      !/^[0-9+\-\s()]{8,20}$/.test(phone)
    ) {
      nextErrors.phone =
        "Enter a valid phone number.";
    }

    if (!form.dateOfBirth) {
      nextErrors.dateOfBirth =
        "Enter your date of birth.";
    } else {
      const dob = new Date(form.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const hadBirthdayThisYear =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
          today.getDate() >= dob.getDate());
      if (!hadBirthdayThisYear) age -= 1;

      if (Number.isNaN(dob.getTime())) {
        nextErrors.dateOfBirth =
          "Enter a valid date.";
      } else if (age < 18) {
        nextErrors.dateOfBirth =
          "You must be at least 18 to register on Onbid.";
      }
    }

    if (!form.password) {
      nextErrors.password =
        "Create a password.";
    } else if (form.password.length < 8) {
      nextErrors.password =
        "Password must contain at least 8 characters.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword =
        "Confirm your password.";
    } else if (
      form.password !== form.confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!form.acceptTerms) {
      nextErrors.acceptTerms =
        "Accept the terms to continue.";
    }

    return nextErrors;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    setServerError(null);

    const validationErrors = validate();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus("loading");

    const payload: RegisterCredentials = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      dateOfBirth: form.dateOfBirth,
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    try {
      await authService.register(payload);

      setStatus("success");
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError(
          "Something went wrong. Please try again.",
        );
      }

      setStatus("error");
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-panel">
        <div className="signup-brand">
          ONBID
        </div>

        <div className="signup-live">
          <span />
          JOIN THE AUCTION HOUSE
        </div>

        <div className="signup-eyebrow">
          CREATE YOUR ACCOUNT
        </div>

        <h1>
          Start
          <br />
          <em>bidding.</em>
        </h1>

        <p className="signup-description">
          Create your OnBid account to discover,
          follow and bid on exceptional pieces.
        </p>

        {status === "success" ? (
          <div
            className="signup-success"
            role="status"
          >
            <div className="signup-success-icon">
              ✓
            </div>

            <h2>
              Account request received.
            </h2>

            <p>
              Your account has been created
              successfully. Once email verification
              is connected, your verification
              instructions will appear here.
            </p>
          </div>
        ) : (
          <form
            className="signup-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="signup-field">
              <label htmlFor="fullName">
                Full name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                aria-invalid={Boolean(
                  errors.fullName,
                )}
                aria-describedby={
                  errors.fullName
                    ? "fullName-error"
                    : undefined
                }
                disabled={status === "loading"}
              />

              {errors.fullName && (
                <span
                  id="fullName-error"
                  className="field-error"
                >
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className="signup-field">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                aria-invalid={Boolean(
                  errors.email,
                )}
                aria-describedby={
                  errors.email
                    ? "email-error"
                    : undefined
                }
                disabled={status === "loading"}
              />

              {errors.email && (
                <span
                  id="email-error"
                  className="field-error"
                >
                  {errors.email}
                </span>
              )}
            </div>

            <div className="signup-field">
              <label htmlFor="phone">
                Phone number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                aria-invalid={Boolean(
                  errors.phone,
                )}
                aria-describedby={
                  errors.phone
                    ? "phone-error"
                    : undefined
                }
                disabled={status === "loading"}
              />

              {errors.phone && (
                <span
                  id="phone-error"
                  className="field-error"
                >
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="signup-field">
              <label htmlFor="dateOfBirth">
                Date of birth
              </label>

              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                autoComplete="bday"
                value={form.dateOfBirth}
                onChange={handleChange}
                aria-invalid={Boolean(
                  errors.dateOfBirth,
                )}
                aria-describedby={
                  errors.dateOfBirth
                    ? "dateOfBirth-error"
                    : undefined
                }
                disabled={status === "loading"}
              />

              {errors.dateOfBirth && (
                <span
                  id="dateOfBirth-error"
                  className="field-error"
                >
                  {errors.dateOfBirth}
                </span>
              )}
            </div>

            <div className="signup-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="password-input">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  aria-invalid={Boolean(
                    errors.password,
                  )}
                  aria-describedby={
                    errors.password
                      ? "password-error"
                      : undefined
                  }
                  disabled={
                    status === "loading"
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={
                    status === "loading"
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {form.password && (
                <div
                  className="password-strength"
                  aria-live="polite"
                >
                  <div className="strength-track">
                    {[1, 2, 3, 4, 5].map(
                      (level) => (
                        <span
                          key={level}
                          className={
                            level <=
                            passwordStrength.score
                              ? "strength-level active"
                              : "strength-level"
                          }
                        />
                      ),
                    )}
                  </div>

                  <small>
                    {passwordStrength.label}
                  </small>
                </div>
              )}

              {errors.password && (
                <span
                  id="password-error"
                  className="field-error"
                >
                  {errors.password}
                </span>
              )}
            </div>

            <div className="signup-field">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <div className="password-input">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  aria-invalid={Boolean(
                    errors.confirmPassword,
                  )}
                  aria-describedby={
                    errors.confirmPassword
                      ? "confirmPassword-error"
                      : undefined
                  }
                  disabled={
                    status === "loading"
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current,
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={
                    status === "loading"
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {errors.confirmPassword && (
                <span
                  id="confirmPassword-error"
                  className="field-error"
                >
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <label className="terms-option">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
                disabled={status === "loading"}
              />

              <span>
                I agree to the OnBid terms and
                privacy policy.
              </span>
            </label>

            {errors.acceptTerms && (
              <span className="field-error terms-error">
                {errors.acceptTerms}
              </span>
            )}

            {serverError && (
              <div
                className="signup-form-error"
                role="alert"
                aria-live="polite"
              >
                {serverError}
              </div>
            )}

            <button
              className="signup-button"
              type="submit"
              disabled={status === "loading"}
              aria-busy={
                status === "loading"
              }
            >
              <span>
                {status === "loading"
                  ? "Creating account..."
                  : "Create account"}
              </span>

              <strong>→</strong>
            </button>
          </form>
        )}

        <div className="signup-footer">
          Already have an OnBid account?

          <button
            type="button"
            onClick={onBack}
            disabled={status === "loading"}
          >
            Sign in
          </button>
        </div>
      </section>
    </main>
  );
}

export default Signup;