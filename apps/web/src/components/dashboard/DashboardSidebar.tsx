import { NavLink } from "react-router-dom";

import type { UserRole } from "../../types/auth";

type DashboardSidebarProps = {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
};

type NavigationItem = {
  label: string;
  path: string;
};

const ROLE_NAVIGATION: Record<
  UserRole,
  NavigationItem[]
> = {
  bidder: [
    {
      label: "Overview",
      path: "/dashboard/bidder",
    },
    {
      label: "Live Auctions",
      path: "/auctions", // was /live-auctions — no such route; this is the real browse page
    },
    {
      label: "My Bids",
      path: "/my-bids",
    },
    {
      label: "Won Auctions",
      path: "/transactions", // was /won-auctions — no such route; Transactions now shows won/awaiting-payment items
    },
    {
      label: "Watchlist",
      path: "/wishlist",
    },
    {
      label: "Transactions",
      path: "/transactions",
    },
    // "Disputes" removed here — no bidder-facing dispute page exists yet
    // (only /dashboard/seller/disputes and the admin queue do), even though
    // the backend already allows either party to raise one. Flagged as a
    // frontend gap rather than left as a dead link.
  ],

  seller: [
    {
      label: "Overview",
      path: "/dashboard/seller",
    },
    {
      label: "My Listings",
      path: "/my-listings",
    },
    {
      label: "Create Listing",
      path: "/listings/create",
    },
    {
      label: "Verification",
      path: "/my-listings", // was /verification — no standalone page; requesting verification happens per-listing from here
    },
    {
      label: "My Auctions",
      path: "/my-listings", // was /my-auctions — same underlying data, no separate live-only view exists
    },
    {
      label: "Orders",
      path: "/transactions", // was /orders — no such route; Transactions now includes sales, not just purchases
    },
    {
      label: "Disputes",
      path: "/dashboard/seller/disputes",
    },
  ],

  verifier: [
    {
      label: "Overview",
      path: "/dashboard/verifier",
    },
    {
      label: "Verification Queue",
      path: "/verification/queue",
    },
    {
      label: "Scheduled",
      path: "/verification/scheduled",
    },
    {
      label: "Completed",
      path: "/verification/completed",
    },
    // "Verification History" removed — /verification/history doesn't
    // exist; Completed above already covers this same data.
  ],

  // Left entirely untouched — real planned feature, not wired to any
  // backend yet, per explicit direction to treat this as a future phase
  // rather than something to fix or hide for this pass.
  auctioneer: [
    {
      label: "Overview",
      path: "/dashboard/auctioneer",
    },
    {
      label: "Auctions",
      path: "/auctioneer/auctions",
    },
    {
      label: "Schedule",
      path: "/auctioneer/schedule",
    },
    {
      label: "Live Control",
      path: "/auctioneer/live",
    },
    {
      label: "Bid Activity",
      path: "/auctioneer/activity",
    },
    {
      label: "Auction Results",
      path: "/auctioneer/results",
    },
  ],

  admin: [
    {
      label: "Overview",
      path: "/dashboard/admin",
    },
    {
      label: "Disputes",
      path: "/dashboard/admin/disputes", // was the wrong path (/admin/disputes) even for this one real page
    },
    // Users, Roles & Permissions, Auctions, Listings, Verification,
    // Transactions, and Platform were all removed from this list — none of
    // them have a frontend page yet. Verification's *backend* is ready
    // (GET /api/admin/verification-requests, GET /api/admin/verifiers) and
    // waiting for a page to call it; the rest need both a page and, in
    // most cases, backend endpoints that don't exist yet either. All
    // flagged in the final report rather than left as dead links.
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  bidder: "Bidder",
  seller: "Seller",
  verifier: "Verifier",
  auctioneer: "Auctioneer",
  admin: "Administrator",
};

function DashboardSidebar({
  role,
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const navigation =
    ROLE_NAVIGATION[role];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="dashboard-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={
          isOpen
            ? "dashboard-sidebar is-open"
            : "dashboard-sidebar"
        }
      >
        <div className="dashboard-sidebar-top">
          <div className="dashboard-sidebar-brand">
            <span>ONBID</span>
            <small>AUCTION HOUSE</small>
          </div>

          <button
            type="button"
            className="dashboard-sidebar-close"
            aria-label="Close navigation"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="dashboard-role">
          <span>YOUR ROLE</span>
          <strong>{ROLE_LABELS[role]}</strong>
        </div>

        <nav
          className="dashboard-navigation"
          aria-label="Dashboard navigation"
        >
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.startsWith(
                "/dashboard/",
              )}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? "dashboard-nav-item active"
                  : "dashboard-nav-item"
              }
            >
              <span className="dashboard-nav-marker" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dashboard-sidebar-bottom">
          <NavLink
            to="/profile"
            onClick={onClose}
            className="dashboard-nav-secondary"
          >
            Profile
          </NavLink>

          {/* "Settings" removed — no page and no backend concept exists
              for it yet (no account-settings endpoints beyond Profile).
              Flagged as a gap rather than left as a dead link. */}
        </div>
      </aside>
    </>
  );
}

export default DashboardSidebar;