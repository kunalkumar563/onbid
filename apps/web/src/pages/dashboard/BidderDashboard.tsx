import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function BidderDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout role="bidder">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              BIDDER WORKSPACE
            </span>

            <h1>
              Bid with
              <br />
              <em>confidence.</em>
            </h1>
          </div>

          <p>
            Welcome back
            {user?.fullName
              ? `, ${user.fullName}`
              : ""}.
            Discover verified auctions, manage your
            bids and complete your winning purchases.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Active Bids</span>

            <strong>—</strong>

            <small>
              Connect your account to load live data
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Winning Auctions</span>

            <strong>—</strong>

            <small>
              No live result loaded
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Watchlist</span>

            <strong>—</strong>

            <small>
              Live watchlist data will appear here
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Transactions</span>

            <strong>—</strong>

            <small>
              Transaction data will appear here
            </small>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>AUCTIONS</span>

                <h2>Live auctions</h2>
              </div>

              <Link
                to="/auctions"
                className="dashboard-panel-link"
              >
                View all
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No live auction data available
                </strong>

                <p>
                  Live auction information will be
                  loaded from the OnBid backend.
                </p>

                <div className="dashboard-actions">
                  <Link
                    to="/auctions"
                    className="dashboard-action"
                  >
                    <span>
                      Explore auctions
                    </span>

                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>ACTIVITY</span>

                <h2>Recent bids</h2>
              </div>

              <Link
                to="/my-bids"
                className="dashboard-panel-link"
              >
                Bid history
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No bid activity available
                </strong>

                <p>
                  Your bid history will appear here
                  once connected to the bidding API.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>ACCOUNT</span>

                <h2>Winning purchases</h2>
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
                  No winning purchases available
                </strong>

                <p>
                  Winning transaction information will
                  appear after the backend returns it.
                </p>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>ACTION</span>

                <h2>Start bidding</h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-actions">
                <Link
                  to="/auctions"
                  className="dashboard-action"
                >
                  <span>
                    Explore auctions
                  </span>

                  <span>→</span>
                </Link>

                <Link
                  to="/my-bids"
                  className="dashboard-action"
                >
                  <span>
                    View my bid history
                  </span>

                  <span>→</span>
                </Link>

                <Link
                  to="/wishlist"
                  className="dashboard-action"
                >
                  <span>
                    Open my watchlist
                  </span>

                  <span>→</span>
                </Link>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>
                PAYMENT & DELIVERY
              </span>

              <h2>Winning transaction</h2>
            </div>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-empty">
              <strong>
                Nothing requires your attention
              </strong>

              <p>
                Payment, delivery confirmation and
                dispute information will appear here
                when available from the backend.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}