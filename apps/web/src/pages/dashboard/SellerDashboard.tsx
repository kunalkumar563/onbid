import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function SellerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout role="seller">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              SELLER WORKSPACE
            </span>

            <h1>
              Your
              <br />
              <em>collection.</em>
            </h1>
          </div>

          <p>
            Welcome back
            {user?.fullName
              ? `, ${user.fullName}`
              : ""}.
            Create listings, manage verification and
            follow your items through the auction journey.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>My Listings</span>
            <strong>—</strong>
            <small>
              Listing data will load from the backend
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Verification</span>
            <strong>—</strong>
            <small>
              Verification status will appear here
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Active Auctions</span>
            <strong>—</strong>
            <small>
              Auction data will appear here
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Payouts</span>
            <strong>—</strong>
            <small>
              Payout information will appear here
            </small>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>LISTINGS</span>
                <h2>My listings</h2>
              </div>

              <Link
                to="/my-listings"
                className="dashboard-panel-link"
              >
                View all
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No listing data available
                </strong>

                <p>
                  Your listings will appear here once
                  the listings API is connected.
                </p>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>VERIFICATION</span>
                <h2>Item verification</h2>
              </div>

              <Link
                to="/verification"
                className="dashboard-panel-link"
              >
                Open
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No verification data available
                </strong>

                <p>
                  Verification requests and results will
                  appear here from the backend.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>AUCTIONS</span>
                <h2>My auctions</h2>
              </div>

              <Link
                to="/my-auctions"
                className="dashboard-panel-link"
              >
                View all
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No auction data available
                </strong>

                <p>
                  Only verified items can progress into
                  the auction flow.
                </p>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>SALES</span>
                <h2>Orders & payouts</h2>
              </div>

              <Link
                to="/transactions"
                className="dashboard-panel-link"
              >
                Transactions
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No transaction data available
                </strong>

                <p>
                  Sale, shipping and payout information
                  will appear when returned by the backend.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>SELLER ACTIONS</span>
              <h2>Manage your collection</h2>
            </div>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-actions">
              <Link
                to="/listings/create"
                className="dashboard-action"
              >
                <span>
                  Create a new listing
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/my-listings"
                className="dashboard-action"
              >
                <span>
                  Manage my listings
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/verification"
                className="dashboard-action"
              >
                <span>
                  Check verification
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/transactions"
                className="dashboard-action"
              >
                <span>
                  View transactions
                </span>

                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}