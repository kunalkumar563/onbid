import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function AuctioneerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout role="auctioneer">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              AUCTIONEER WORKSPACE
            </span>

            <h1>
              The auction
              <br />
              <em>room.</em>
            </h1>
          </div>

          <p>
            Welcome back
            {user?.fullName
              ? `, ${user.fullName}`
              : ""}.
            Manage auction schedules, control live
            sessions and monitor bidding activity.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Scheduled Auctions</span>
            <strong>—</strong>
            <small>
              Auction schedule data from backend
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Live Auctions</span>
            <strong>—</strong>
            <small>
              Current live auction data
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Bid Activity</span>
            <strong>—</strong>
            <small>
              Live activity will appear here
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Results</span>
            <strong>—</strong>
            <small>
              Completed auction results
            </small>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>AUCTION CALENDAR</span>

                <h2>
                  Upcoming auctions
                </h2>
              </div>

              <Link
                to="/auctioneer/schedule"
                className="dashboard-panel-link"
              >
                Schedule
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No auction schedule available
                </strong>

                <p>
                  Upcoming auction information will be
                  loaded from the connected backend.
                </p>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>LIVE CONTROL</span>

                <h2>
                  Auction room
                </h2>
              </div>

              <Link
                to="/auctioneer/live"
                className="dashboard-panel-link"
              >
                Open
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No live auction session
                </strong>

                <p>
                  Live controls become available when an
                  authorized auction session is active.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>MONITORING</span>

                <h2>
                  Bid activity
                </h2>
              </div>

              <Link
                to="/auctioneer/activity"
                className="dashboard-panel-link"
              >
                View activity
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No bid activity available
                </strong>

                <p>
                  Bid activity will be displayed from the
                  auction backend when a live auction is
                  running.
                </p>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>RESULTS</span>

                <h2>
                  Auction results
                </h2>
              </div>

              <Link
                to="/auctioneer/results"
                className="dashboard-panel-link"
              >
                View results
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No completed results available
                </strong>

                <p>
                  Completed auction results will appear
                  here once returned by the backend.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>AUCTION OPERATIONS</span>

              <h2>
                Manage the auction room
              </h2>
            </div>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-actions">
              <Link
                to="/auctioneer/auctions"
                className="dashboard-action"
              >
                <span>
                  Manage auctions
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/auctioneer/schedule"
                className="dashboard-action"
              >
                <span>
                  Manage schedule
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/auctioneer/live"
                className="dashboard-action"
              >
                <span>
                  Open live control
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/auctioneer/results"
                className="dashboard-action"
              >
                <span>
                  Review auction results
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