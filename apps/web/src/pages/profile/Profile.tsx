import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

type AccountUser = {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
};

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
};

function formatRole(role?: string) {
  if (!role) {
    return "User";
  }

  return (
    role.charAt(0).toUpperCase() +
    role.slice(1)
  );
}

export default function Profile() {
  const { user, role } = useAuth();

  const account = user as AccountUser | null;

  const dashboardPath = useMemo(() => {
    switch (role) {
      case "bidder":
        return "/dashboard/bidder";

      case "seller":
        return "/dashboard/seller";

      case "verifier":
        return "/dashboard/verifier";

      case "auctioneer":
        return "/dashboard/auctioneer";

      case "admin":
        return "/dashboard/admin";

      default:
        return "/dashboard";
    }
  }, [role]);

  const [isEditing, setIsEditing] =
    useState(false);

  const [savedMessage, setSavedMessage] =
    useState("");

  const [form, setForm] =
    useState<ProfileForm>({
      fullName: account?.fullName ?? "",
      email: account?.email ?? "",
      phone: account?.phone ?? "",
    });

  const displayName =
    form.fullName.trim() ||
    account?.fullName ||
    "OnBid User";

  const displayRole =
    formatRole(
      account?.role ??
        role ??
        undefined,
    );

  const initials = useMemo(() => {
    const parts = displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) {
      return "OB";
    }

    if (parts.length === 1) {
      return parts[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [displayName]);

  function updateField(
    field: keyof ProfileForm,
    value: string,
  ) {
    setSavedMessage("");

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleCancel() {
    setForm({
      fullName:
        account?.fullName ?? "",
      email:
        account?.email ?? "",
      phone:
        account?.phone ?? "",
    });

    setSavedMessage("");
    setIsEditing(false);
  }

  function handleSave() {
    if (!form.fullName.trim()) {
      setSavedMessage(
        "Full name is required.",
      );

      return;
    }

    /*
     * Frontend-only for now.
     *
     * Later this will call the profile API.
     * We intentionally do not invent a backend
     * endpoint at this stage.
     */

    setSavedMessage(
      "Profile changes are ready. They will be saved permanently once the account API is connected.",
    );

    setIsEditing(false);
  }

  return (
    <DashboardLayout
      role={
        role ??
        "bidder"
      }
    >
      <div className="dashboard-page">
        {/* =================================================
           HEADING
           ================================================= */}

        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              ACCOUNT
            </span>

            <h1>
              Your
              <br />
              <em>profile.</em>
            </h1>
          </div>

          <p>
            Manage your personal information,
            account identity and access details
            from one place.
          </p>
        </section>

        {/* =================================================
           PROFILE HERO
           ================================================= */}

        <section
          className="dashboard-panel"
          style={{
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "28px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: "76px",
                  height: "76px",
                  borderRadius: "24px",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  background:
                    "linear-gradient(135deg, #111827 0%, #6d28d9 100%)",
                  color: "#ffffff",
                  fontSize: "22px",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  boxShadow:
                    "0 18px 40px rgba(109, 40, 217, 0.18)",
                }}
              >
                {initials}
              </div>

              <div
                style={{
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    padding:
                      "6px 10px",
                    borderRadius:
                      "999px",
                    background:
                      "rgba(109, 40, 217, 0.08)",
                    color:
                      "#6d28d9",
                    fontSize:
                      "11px",
                    fontWeight: 700,
                    letterSpacing:
                      "0.08em",
                    textTransform:
                      "uppercase",
                  }}
                >
                  {displayRole}
                </span>

                <h2
                  style={{
                    margin:
                      "10px 0 0",
                    fontSize:
                      "24px",
                    lineHeight: 1.2,
                  }}
                >
                  {displayName}
                </h2>

                <p
                  style={{
                    margin:
                      "6px 0 0",
                    color:
                      "#64748b",
                    fontSize:
                      "14px",
                  }}
                >
                  {form.email ||
                    "Account email will appear here"}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <Link
                to={dashboardPath}
                className="dashboard-panel-link"
              >
                Dashboard
              </Link>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setSavedMessage("");
                    setIsEditing(true);
                  }}
                  style={{
                    border: 0,
                    borderRadius:
                      "12px",
                    padding:
                      "11px 16px",
                    background:
                      "#111827",
                    color:
                      "#ffffff",
                    fontWeight: 600,
                    cursor:
                      "pointer",
                  }}
                >
                  Edit profile
                </button>
              )}
            </div>
          </div>
        </section>

        {/* =================================================
           PROFILE STATS
           ================================================= */}

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>
              Account
            </span>

            <strong>
              Active
            </strong>

            <small>
              OnBid account status
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>
              Role
            </span>

            <strong
              style={{
                fontSize:
                  "22px",
              }}
            >
              {displayRole}
            </strong>

            <small>
              Current platform access
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>
              KYC
            </span>

            <strong>
              —
            </strong>

            <small>
              Verification data pending
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>
              Security
            </span>

            <strong>
              —
            </strong>

            <small>
              Security data pending
            </small>
          </article>
        </section>

        {/* =================================================
           PERSONAL INFO + ACCOUNT
           ================================================= */}

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  PERSONAL INFORMATION
                </span>

                <h2>
                  Profile details
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div
                style={{
                  display: "grid",
                  gap: "18px",
                }}
              >
                <label
                  style={{
                    display:
                      "grid",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize:
                        "12px",
                      fontWeight: 700,
                      color:
                        "#64748b",
                      letterSpacing:
                        "0.06em",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    Full name
                  </span>

                  <input
                    type="text"
                    value={
                      form.fullName
                    }
                    disabled={
                      !isEditing
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "fullName",
                        event.target
                          .value,
                      )
                    }
                    placeholder="Your full name"
                    style={{
                      width: "100%",
                      minHeight:
                        "46px",
                      boxSizing:
                        "border-box",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        "12px",
                      padding:
                        "0 14px",
                      background:
                        isEditing
                          ? "#ffffff"
                          : "#f8fafc",
                      color:
                        "#0f172a",
                      outline:
                        "none",
                    }}
                  />
                </label>

                <label
                  style={{
                    display:
                      "grid",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize:
                        "12px",
                      fontWeight: 700,
                      color:
                        "#64748b",
                      letterSpacing:
                        "0.06em",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    Email
                  </span>

                  <input
                    type="email"
                    value={
                      form.email
                    }
                    disabled={
                      !isEditing
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "email",
                        event.target
                          .value,
                      )
                    }
                    placeholder="name@example.com"
                    style={{
                      width: "100%",
                      minHeight:
                        "46px",
                      boxSizing:
                        "border-box",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        "12px",
                      padding:
                        "0 14px",
                      background:
                        isEditing
                          ? "#ffffff"
                          : "#f8fafc",
                      color:
                        "#0f172a",
                      outline:
                        "none",
                    }}
                  />
                </label>

                <label
                  style={{
                    display:
                      "grid",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize:
                        "12px",
                      fontWeight: 700,
                      color:
                        "#64748b",
                      letterSpacing:
                        "0.06em",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    Phone number
                  </span>

                  <input
                    type="tel"
                    value={
                      form.phone
                    }
                    disabled={
                      !isEditing
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "phone",
                        event.target
                          .value,
                      )
                    }
                    placeholder="+91"
                    style={{
                      width: "100%",
                      minHeight:
                        "46px",
                      boxSizing:
                        "border-box",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        "12px",
                      padding:
                        "0 14px",
                      background:
                        isEditing
                          ? "#ffffff"
                          : "#f8fafc",
                      color:
                        "#0f172a",
                      outline:
                        "none",
                    }}
                  />
                </label>

                {savedMessage && (
                  <div
                    style={{
                      border:
                        "1px solid #ddd6fe",
                      background:
                        "#f5f3ff",
                      color:
                        "#5b21b6",
                      borderRadius:
                        "12px",
                      padding:
                        "12px 14px",
                      fontSize:
                        "13px",
                      lineHeight:
                        1.6,
                    }}
                  >
                    {savedMessage}
                  </div>
                )}

                {isEditing && (
                  <div
                    style={{
                      display:
                        "flex",
                      flexWrap:
                        "wrap",
                      gap: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={
                        handleSave
                      }
                      style={{
                        border: 0,
                        borderRadius:
                          "12px",
                        padding:
                          "11px 18px",
                        background:
                          "#111827",
                        color:
                          "#ffffff",
                        fontWeight:
                          600,
                        cursor:
                          "pointer",
                      }}
                    >
                      Save changes
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleCancel
                      }
                      style={{
                        border:
                          "1px solid #e2e8f0",
                        borderRadius:
                          "12px",
                        padding:
                          "11px 18px",
                        background:
                          "#ffffff",
                        color:
                          "#334155",
                        fontWeight:
                          600,
                        cursor:
                          "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* =================================================
             ACCOUNT INFORMATION
             ================================================= */}

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  ACCOUNT
                </span>

                <h2>
                  Account access
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-actions">
                <div className="dashboard-action">
                  <span>
                    Account role
                  </span>

                  <strong>
                    {displayRole}
                  </strong>
                </div>

                <div className="dashboard-action">
                  <span>
                    Account status
                  </span>

                  <strong>
                    Active
                  </strong>
                </div>

                <div className="dashboard-action">
                  <span>
                    Identity verification
                  </span>

                  <span>
                    —
                  </span>
                </div>

                <div className="dashboard-action">
                  <span>
                    Member since
                  </span>

                  <span>
                    —
                  </span>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* =================================================
           SECURITY + KYC
           ================================================= */}

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  SECURITY
                </span>

                <h2>
                  Sign-in & security
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-actions">
                <button
                  type="button"
                  disabled
                  className="dashboard-action"
                  style={{
                    width: "100%",
                    border: 0,
                    textAlign: "left",
                    opacity: 0.55,
                    cursor:
                      "not-allowed",
                  }}
                >
                  <span>
                    Change password
                  </span>

                  <span>
                    →
                  </span>
                </button>

                <button
                  type="button"
                  disabled
                  className="dashboard-action"
                  style={{
                    width: "100%",
                    border: 0,
                    textAlign: "left",
                    opacity: 0.55,
                    cursor:
                      "not-allowed",
                  }}
                >
                  <span>
                    Two-factor authentication
                  </span>

                  <span>
                    →
                  </span>
                </button>
              </div>

              <div
                className="dashboard-empty"
                style={{
                  marginTop:
                    "18px",
                }}
              >
                <strong>
                  Security API pending
                </strong>

                <p>
                  Password and advanced security
                  settings will become active when
                  the authentication backend is
                  connected.
                </p>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  IDENTITY
                </span>

                <h2>
                  KYC verification
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Verification status unavailable
                </strong>

                <p>
                  Your KYC documents and verification
                  status will appear here once the
                  account verification service is
                  connected.
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* =================================================
           ACCOUNT SETTINGS
           ================================================= */}

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>
                SETTINGS
              </span>

              <h2>
                Account preferences
              </h2>
            </div>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-actions">
              <div className="dashboard-action">
                <span>
                  Email notifications
                </span>

                <span>
                  Coming soon
                </span>
              </div>

              <div className="dashboard-action">
                <span>
                  Auction notifications
                </span>

                <span>
                  Coming soon
                </span>
              </div>

              <div className="dashboard-action">
                <span>
                  Transaction alerts
                </span>

                <span>
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}