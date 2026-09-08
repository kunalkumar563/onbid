import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  auctioneerService,
  type AuctioneerBidActivityItem,
} from "../../services/auctioneer";

type ActivityFilter =
  | "all"
  | "accepted"
  | "rejected"
  | "pending";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusClass(
  status: AuctioneerBidActivityItem["status"],
) {
  switch (status) {
    case "accepted":
      return "success";

    case "rejected":
      return "danger";

    case "pending":
      return "warning";

    default:
      return "neutral";
  }
}

function formatStatus(
  status: AuctioneerBidActivityItem["status"],
) {
  if (!status) {
    return "Accepted";
  }

  return status
    .replace("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export default function AuctioneerBidActivity() {
  const [bids, setBids] = useState<
    AuctioneerBidActivityItem[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] =
    useState<ActivityFilter>("all");

  const loadActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response =
        await auctioneerService.getBidActivity();

      setBids(response.bids);
    } catch (requestError) {
      setBids([]);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Bid activity could not be loaded right now.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadInitialActivity = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await auctioneerService.getBidActivity();

        if (!mounted) {
          return;
        }

        setBids(response.bids);
      } catch (requestError) {
        if (!mounted) {
          return;
        }

        setBids([]);

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Bid activity could not be loaded right now.",
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialActivity();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredBids = useMemo(() => {
    if (selectedStatus === "all") {
      return bids;
    }

    return bids.filter(
      (bid) =>
        (bid.status ?? "accepted") ===
        selectedStatus,
    );
  }, [bids, selectedStatus]);

  const totalBids = bids.length;

  const acceptedBids = bids.filter(
    (bid) =>
      !bid.status ||
      bid.status === "accepted",
  ).length;

  const pendingBids = bids.filter(
    (bid) => bid.status === "pending",
  ).length;

  const highestBid =
    bids.length > 0
      ? Math.max(
          ...bids.map((bid) => bid.amount),
        )
      : 0;

  return (
    <DashboardLayout role="auctioneer">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              AUCTIONEER MONITORING
            </span>

            <h1>
              Bid
              <br />
              <em>activity.</em>
            </h1>
          </div>

          <p>
            Monitor bidding activity across
            active auction sessions and keep
            track of incoming bids in real time.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Total Bids</span>

            <strong>
              {isLoading ? "—" : totalBids}
            </strong>

            <small>
              Bids returned by the auction backend
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Accepted</span>

            <strong>
              {isLoading ? "—" : acceptedBids}
            </strong>

            <small>
              Accepted bidding activity
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Pending</span>

            <strong>
              {isLoading ? "—" : pendingBids}
            </strong>

            <small>
              Activity awaiting processing
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Highest Bid</span>

            <strong>
              {isLoading
                ? "—"
                : formatCurrency(highestBid)}
            </strong>

            <small>
              Highest amount in loaded activity
            </small>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>BID MONITOR</span>

              <h2>
                Recent bidding activity
              </h2>
            </div>

            <Link
              to="/auctioneer/live"
              className="dashboard-panel-link"
            >
              Live Control
            </Link>
          </div>

          <div className="dashboard-panel-body">
            <div className="auction-toolbar">
              {[
                ["all", "All"],
                ["accepted", "Accepted"],
                ["pending", "Pending"],
                ["rejected", "Rejected"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={
                    selectedStatus === value
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() =>
                    setSelectedStatus(
                      value as ActivityFilter,
                    )
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="dashboard-loading">
                Loading bid activity...
              </div>
            ) : error ? (
              <div className="dashboard-empty">
                <strong>
                  Bid activity could not be loaded
                </strong>

                <p>{error}</p>

                <button
                  type="button"
                  onClick={() => void loadActivity()}
                  className="dashboard-panel-action"
                  style={{
                    marginTop: "18px",
                    cursor: "pointer",
                  }}
                >
                  Try again
                </button>
              </div>
            ) : filteredBids.length === 0 ? (
              <div className="dashboard-empty">
                <strong>
                  {bids.length === 0
                    ? "No bid activity available"
                    : "No bids match this filter"}
                </strong>

                <p>
                  {bids.length === 0
                    ? "Bid activity will appear here when auction data is available."
                    : "Try another activity filter to view available bids."}
                </p>
              </div>
            ) : (
              <div className="dashboard-bid-list">
                {filteredBids.map((bid) => (
                  <div
                    key={bid.id}
                    className="dashboard-bid-row"
                  >
                    <div>
                      <strong>
                        {bid.bidderDisplayName}
                      </strong>

                      <span>
                        {bid.auctionTitle}
                      </span>

                      <span>
                        {formatDate(bid.createdAt)}
                      </span>
                    </div>

                    <div>
                      <strong>
                        {formatCurrency(bid.amount)}
                      </strong>

                      <span
                        className={`dashboard-status ${getStatusClass(
                          bid.status,
                        )}`}
                      >
                        {formatStatus(bid.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>OPERATIONS</span>

                <h2>
                  Auction controls
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-actions">
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
                  to="/auctioneer/auctions"
                  className="dashboard-action"
                >
                  <span>
                    Manage auctions
                  </span>

                  <span>→</span>
                </Link>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>RESULTS</span>

                <h2>
                  Completed auctions
                </h2>
              </div>

              <Link
                to="/auctioneer/results"
                className="dashboard-panel-link"
              >
                View Results
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Results are handled separately
                </strong>

                <p>
                  Use the auction results workspace
                  to review completed sessions and
                  winning bids.
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </DashboardLayout>
  );
}