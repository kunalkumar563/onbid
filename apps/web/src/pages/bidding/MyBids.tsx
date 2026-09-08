import { Link } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function MyBids() {
  return (
    <DashboardLayout role="bidder">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              BIDDING ACTIVITY
            </span>

            <h1>
              My
              <br />
              <em>bids.</em>
            </h1>
          </div>

          <p>
            Track your bidding activity, review auction
            participation and return to auctions whenever
            you are ready to bid.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Total Bids</span>

            <strong>—</strong>

            <small>
              Bid history will appear after backend
              connection
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Active Bids</span>

            <strong>—</strong>

            <small>
              Live bidding data is not available yet
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Winning Bids</span>

            <strong>—</strong>

            <small>
              Winning results will appear here
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Auctions Joined</span>

            <strong>—</strong>

            <small>
              Auction participation data will appear here
            </small>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>BID HISTORY</span>

              <h2>
                Your bidding activity
              </h2>
            </div>

            <Link
              to="/auctions"
              className="dashboard-panel-link"
            >
              Browse auctions
            </Link>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-empty">
              <strong>
                No bid history available
              </strong>

              <p>
                Your bids will appear here once the
                bidding service is connected to the
                OnBid backend.
              </p>

              <div className="dashboard-actions">
                <Link
                  to="/auctions"
                  className="dashboard-action"
                >
                  <span>
                    Explore available auctions
                  </span>

                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>LIVE BIDDING</span>

                <h2>
                  Active participation
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No active bidding information
                </strong>

                <p>
                  Current bid position, minimum
                  increments and auction status will
                  be loaded from the backend.
                </p>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>RESULTS</span>

                <h2>
                  Winning bids
                </h2>
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
                  No winning bids available
                </strong>

                <p>
                  Winning auction and payment
                  information will appear after the
                  auction results are returned.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>NEXT STEP</span>

              <h2>
                Find your next auction
              </h2>
            </div>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-actions">
              <Link
                to="/auctions"
                className="dashboard-action"
              >
                <span>
                  Browse all auctions
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/dashboard"
                className="dashboard-action"
              >
                <span>
                  Back to bidder dashboard
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