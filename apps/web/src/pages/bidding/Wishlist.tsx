import { Link } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function Wishlist() {
  return (
    <DashboardLayout role="bidder">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              SAVED AUCTIONS
            </span>

            <h1>
              Your
              <br />
              <em>watchlist.</em>
            </h1>
          </div>

          <p>
            Keep track of auctions you're interested in
            and quickly return when you're ready to bid.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Saved Auctions</span>
            <strong>—</strong>
            <small>
              Watchlist data will appear after backend
              connection
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Live Auctions</span>
            <strong>—</strong>
            <small>
              Live saved auctions will appear here
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Upcoming</span>
            <strong>—</strong>
            <small>
              Upcoming saved auctions will appear here
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Ended</span>
            <strong>—</strong>
            <small>
              Ended saved auctions will appear here
            </small>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>WATCHLIST</span>

              <h2>Saved auctions</h2>
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
                Your watchlist is empty
              </strong>

              <p>
                Auctions you save will appear here so you
                can easily keep track of them.
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
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>LIVE</span>
                <h2>Live watchlist</h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No live saved auctions
                </strong>

                <p>
                  Saved auctions that are currently live
                  will appear in this section.
                </p>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>UPCOMING</span>
                <h2>Upcoming auctions</h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No upcoming saved auctions
                </strong>

                <p>
                  Upcoming auctions from your watchlist
                  will appear here.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>DISCOVER</span>

              <h2>
                Find something worth bidding on
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
                to="/my-bids"
                className="dashboard-action"
              >
                <span>
                  View my bids
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/dashboard"
                className="dashboard-action"
              >
                <span>
                  Back to dashboard
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