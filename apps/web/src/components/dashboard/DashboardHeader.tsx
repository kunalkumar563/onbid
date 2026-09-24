import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types/auth";

type DashboardHeaderProps = {
  role: UserRole;
  onMenuClick: () => void;
};

const ROLE_LABELS: Record<UserRole, string> = {
  bidder: "Bidder",
  seller: "Seller",
  verifier: "Verifier",
  auctioneer: "Auctioneer",
  admin: "Administrator",
};

function DashboardHeader({
  role,
  onMenuClick,
}: DashboardHeaderProps) {
  const { user, clearSession } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const displayName =
    user?.fullName || ROLE_LABELS[role];

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const handleProfile = () => {
    setProfileOpen(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setProfileOpen(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    setProfileOpen(false);
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <button
          type="button"
          className="dashboard-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <div className="dashboard-page-context">
          <Link to="/">
            <img src="/auctions/onbid-logo.png" alt="ONBID" style={{ height: "40px", width: "auto", maxWidth: "140px", objectFit: "contain", objectPosition: "left" }} />
          </Link>
          
          <strong>
            {ROLE_LABELS[role]} Workspace
          </strong>
        </div>
      </div>

      <div className="dashboard-header-right">
        <button
          type="button"
          className="dashboard-notification-button"
          aria-label="Notifications"
        >
          <span className="dashboard-notification-icon">
            ♢
          </span>

          <span className="dashboard-notification-dot" />
        </button>

        <div className="dashboard-profile">
          <button
            type="button"
            className="dashboard-profile-button"
            onClick={() =>
              setProfileOpen((open) => !open)
            }
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <span className="dashboard-avatar">
              {initials || "O"}
            </span>

            <span className="dashboard-profile-info">
              <strong>{displayName}</strong>

              <small>
                {ROLE_LABELS[role]}
              </small>
            </span>

            <span
              className={
                profileOpen
                  ? "dashboard-profile-chevron open"
                  : "dashboard-profile-chevron"
              }
            >
              ↓
            </span>
          </button>

          {profileOpen && (
            <div
              className="dashboard-profile-menu"
              role="menu"
            >
              <div className="dashboard-profile-menu-header">
                <strong>{displayName}</strong>

                <span>
                  {user?.email || ""}
                </span>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={handleProfile}
              >
                Profile
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={handleSettings}
              >
                Settings
              </button>

              <div className="dashboard-profile-menu-divider" />

              <button
                type="button"
                role="menuitem"
                className="dashboard-logout"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;