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
    { label: "Overview", path: "/dashboard/bidder" },
    { label: "Live Auctions", path: "/dashboard/bidder/auctions" },
    { label: "My Bids", path: "/dashboard/bidder/my-bids" },
    { label: "Won Auctions", path: "/dashboard/bidder/won" },
    { label: "Watchlist", path: "/dashboard/bidder/watchlist" },
    { label: "Orders", path: "/dashboard/bidder/orders" },
    { label: "Transactions", path: "/dashboard/bidder/transactions" },
    { label: "KYC Verification", path: "/dashboard/bidder/kyc" },
    { label: "Payouts & Wallet", path: "/dashboard/bidder/payouts" },
    { label: "My Account", path: "/dashboard/bidder/account" },
    { label: "Settings", path: "/dashboard/bidder/settings" }
  ],

  seller: [
    { label: "Overview", path: "/dashboard/seller" },
    { label: "My Listings", path: "/dashboard/seller/listings" },
    { label: "Create Listing", path: "/listings/create" },
    { label: "Verification", path: "/dashboard/seller/verification" },
    { label: "My Auctions", path: "/dashboard/seller/auctions" },
    { label: "Orders", path: "/dashboard/seller/orders" },
    { label: "Disputes", path: "/dashboard/seller/disputes" },
    { label: "Messages", path: "/dashboard/seller/messages" },
    { label: "Payouts", path: "/dashboard/seller/payouts" },
    { label: "Settings", path: "/dashboard/seller/settings" }
  ],

  verifier: [
    { label: "Overview", path: "/dashboard/verifier" },
    { label: "Verification Queue", path: "/dashboard/verifier/queue" },
    { label: "Scheduled", path: "/dashboard/verifier/scheduled" },
    { label: "Completed", path: "/dashboard/verifier/completed" },
    { label: "Rejections", path: "/dashboard/verifier/rejections" },
    { label: "Reports", path: "/dashboard/verifier/reports" },
    { label: "Messages", path: "/dashboard/verifier/messages" },
    { label: "Settings", path: "/dashboard/verifier/settings" }
  ],

  // Left entirely untouched — real planned feature, not wired to any
  // backend yet, per explicit direction to treat this as a future phase
  // rather than something to fix or hide for this pass.
  auctioneer: [
    { label: "Overview", path: "/dashboard/auctioneer" },
    { label: "Auctions", path: "/dashboard/auctioneer/auctions" },
    { label: "Schedule", path: "/dashboard/auctioneer/schedule" },
    { label: "Live Control", path: "/dashboard/auctioneer/live" },
    { label: "Bid Activity", path: "/dashboard/auctioneer/activity" },
    { label: "Auction Results", path: "/dashboard/auctioneer/results" },
    { label: "Users & Bidders", path: "/dashboard/auctioneer/users" },
    { label: "Orders", path: "/dashboard/auctioneer/orders" },
    { label: "Transactions", path: "/dashboard/auctioneer/transactions" },
    { label: "Disputes", path: "/dashboard/auctioneer/disputes" },
    { label: "Messages", path: "/dashboard/auctioneer/messages" },
    { label: "Payouts", path: "/dashboard/auctioneer/payouts" },
    { label: "My Account", path: "/dashboard/auctioneer/account" },
    { label: "Settings", path: "/dashboard/auctioneer/settings" }
  ],

  admin: [
    { label: "Overview", path: "/dashboard/admin" },
    { label: "Users & Roles", path: "/dashboard/admin/users" },
    { label: "Auctions", path: "/dashboard/admin/auctions" },
    { label: "Verification", path: "/dashboard/admin/verification" },
    { label: "Transactions", path: "/dashboard/admin/transactions" },
    { label: "Orders", path: "/dashboard/admin/orders" },
    { label: "Disputes", path: "/dashboard/admin/disputes" },
    { label: "Reports", path: "/dashboard/admin/reports" },
    { label: "Messages", path: "/dashboard/admin/messages" },
    { label: "Settings", path: "/dashboard/admin/settings" }
  ]
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
              key={item.label}
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
            to="/"
            onClick={onClose}
            className="dashboard-nav-secondary"
            style={{ marginBottom: '10px' }}
          >
            ← Back to Home
          </NavLink>
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