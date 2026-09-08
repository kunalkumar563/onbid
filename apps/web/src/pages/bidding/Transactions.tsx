import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { transactionService } from "../../services/transactions";
import type { Transaction } from "../../services/transactions";
import { ApiError } from "../../services/api/client";

type LoadStatus = "idle" | "loading" | "success" | "error";

const STATUS_LABELS: Record<
  Transaction["status"],
  string
> = {
  awaiting_payment: "Awaiting payment",
  paid: "Paid — awaiting dispatch",
  delivered: "Delivered — awaiting release",
  released: "Complete",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);
  const [status, setStatus] =
    useState<LoadStatus>("idle");
  const [error, setError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const data =
          await transactionService.getMine();
        if (!cancelled) {
          setTransactions(data);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Could not load your transactions.",
          );
          setStatus("error");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const pendingPayment = transactions.filter(
    (t) => t.status === "awaiting_payment",
  ).length;
  const inDelivery = transactions.filter(
    (t) => t.status === "paid" || t.status === "delivered",
  ).length;
  const disputed = transactions.filter(
    (t) => t.status === "refunded",
  ).length;

  return (
    <DashboardLayout role="bidder">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              ACCOUNT & PAYMENTS
            </span>

            <h1>
              My
              <br />
              <em>transactions.</em>
            </h1>
          </div>

          <p>
            Review your winning purchases, payment status,
            delivery progress and transaction activity —
            as both buyer and seller.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Total Transactions</span>

            <strong>
              {status === "success"
                ? transactions.length
                : "—"}
            </strong>

            <small>
              {status === "loading"
                ? "Loading…"
                : "Across purchases and sales"}
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Awaiting Payment</span>

            <strong>
              {status === "success"
                ? pendingPayment
                : "—"}
            </strong>

            <small>Winning bids not yet paid</small>
          </article>

          <article className="dashboard-stat-card">
            <span>In Delivery</span>

            <strong>
              {status === "success" ? inDelivery : "—"}
            </strong>

            <small>Paid, dispatched, or in transit</small>
          </article>

          <article className="dashboard-stat-card">
            <span>Refunded</span>

            <strong>
              {status === "success" ? disputed : "—"}
            </strong>

            <small>Resolved via dispute</small>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>TRANSACTION HISTORY</span>

              <h2>Your transactions</h2>
            </div>

            <Link
              to="/auctions"
              className="dashboard-panel-link"
            >
              Browse auctions
            </Link>
          </div>

          <div className="dashboard-panel-body">
            {status === "loading" && (
              <div className="dashboard-empty">
                <strong>Loading your transactions…</strong>
              </div>
            )}

            {status === "error" && (
              <div className="dashboard-empty">
                <strong>
                  Couldn't load your transactions
                </strong>
                <p>{error}</p>
              </div>
            )}

            {status === "success" &&
              transactions.length === 0 && (
                <div className="dashboard-empty">
                  <strong>
                    No transactions available
                  </strong>

                  <p>
                    Your winning auction transactions will
                    appear here once you've won an auction
                    or sold an item.
                  </p>

                  <div className="dashboard-actions">
                    <Link
                      to="/auctions"
                      className="dashboard-action"
                    >
                      <span>Explore auctions</span>
                      <span>→</span>
                    </Link>

                    <Link
                      to="/my-bids"
                      className="dashboard-action"
                    >
                      <span>View my bids</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              )}

            {status === "success" &&
              transactions.length > 0 && (
                <ul className="dashboard-list">
                  {transactions.map((t) => (
                    <li
                      key={t.id}
                      className="dashboard-list-item"
                    >
                      <div>
                        <strong>
                          {t.auction?.title ??
                            "Untitled listing"}
                        </strong>
                        <p>
                          {t.role === "buyer"
                            ? "Purchase"
                            : "Sale"}{" "}
                          · ₹{t.amount} ·{" "}
                          {STATUS_LABELS[t.status]}
                        </p>
                      </div>

                      {t.status === "awaiting_payment" &&
                        t.role === "buyer" && (
                          <Link
                            to={`/auctions/${t.auctionId}/payment`}
                            className="dashboard-action"
                          >
                            <span>Pay now</span>
                            <span>→</span>
                          </Link>
                        )}

                      {t.status === "paid" &&
                        t.role === "buyer" && (
                          <Link
                            to={`/delivery/${t.id}`}
                            className="dashboard-action"
                          >
                            <span>Confirm delivery</span>
                            <span>→</span>
                          </Link>
                        )}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>NEXT STEP</span>

              <h2>
                Continue exploring
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
                  Browse auctions
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