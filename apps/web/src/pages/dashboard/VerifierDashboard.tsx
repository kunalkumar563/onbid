import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  verificationService,
  type VerificationRequest,
} from "../../services/verification";
import { ApiError } from "../../services/api/client";

export default function VerifierDashboard() {
  const { user } = useAuth();

  const [requests, setRequests] = useState<
    VerificationRequest[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response =
        await verificationService.getMyQueue();

      setRequests(response.requests);
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError(
          "Unable to load the verification queue.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  const pendingCount = requests.filter(
    (request) =>
      request.status === "pending",
  ).length;

  const scheduledCount = requests.filter(
    (request) =>
      request.status === "scheduled",
  ).length;

  const completedCount = requests.filter(
    (request) =>
      request.status === "passed" ||
      request.status === "failed",
  ).length;

  return (
    <DashboardLayout role="verifier">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              VERIFIER WORKSPACE
            </span>

            <h1>
              Verification
              <br />
              <em>desk.</em>
            </h1>
          </div>

          <p>
            Welcome back
            {user?.fullName
              ? `, ${user.fullName}`
              : ""}.
            Review assigned requests, complete
            inspections and submit your verification
            results.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Pending</span>

            <strong>
              {isLoading ? "—" : pendingCount}
            </strong>

            <small>
              Assigned requests awaiting inspection
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Scheduled</span>

            <strong>
              {isLoading ? "—" : scheduledCount}
            </strong>

            <small>
              Scheduled verification visits
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Completed</span>

            <strong>
              {isLoading ? "—" : completedCount}
            </strong>

            <small>
              Completed verification requests
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Total Queue</span>

            <strong>
              {isLoading
                ? "—"
                : requests.length}
            </strong>

            <small>
              Requests returned by the backend
            </small>
          </article>
        </section>

        {error && (
          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Verification queue unavailable
                </strong>

                <p>{error}</p>

                <button
                  type="button"
                  className="dashboard-action"
                  onClick={() =>
                    void loadQueue()
                  }
                >
                  <span>Try again</span>
                  <span>↻</span>
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>ASSIGNED WORK</span>

                <h2>
                  Verification queue
                </h2>
              </div>

              <button
                type="button"
                className="dashboard-panel-link"
                onClick={() =>
                  void loadQueue()
                }
              >
                Refresh
              </button>
            </div>

            <div className="dashboard-panel-body">
              {isLoading ? (
                <div className="dashboard-loading">
                  Loading verification queue
                </div>
              ) : requests.length === 0 ? (
                <div className="dashboard-empty">
                  <strong>
                    No verification requests
                  </strong>

                  <p>
                    Your assigned verification queue
                    is currently empty.
                  </p>
                </div>
              ) : (
                <div className="dashboard-table-wrap">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Request</th>
                        <th>Listing</th>
                        <th>Status</th>
                        <th>Scheduled</th>
                      </tr>
                    </thead>

                    <tbody>
                      {requests.map(
                        (request) => (
                          <tr key={request.id}>
                            <td>
                              {request.id}
                            </td>

                            <td>
                              {request.listingId}
                            </td>

                            <td>
                              <span
                                className={`dashboard-status ${
                                  request.status ===
                                  "passed"
                                    ? "success"
                                    : request.status ===
                                        "failed"
                                      ? "danger"
                                      : request.status ===
                                          "scheduled"
                                        ? "warning"
                                        : "neutral"
                                }`}
                              >
                                {request.status.replace(
                                  "_",
                                  " ",
                                )}
                              </span>
                            </td>

                            <td>
                              {request.scheduledAt
                                ? new Date(
                                    request.scheduledAt,
                                  ).toLocaleString()
                                : "Not scheduled"}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>WORKFLOW</span>

                <h2>
                  Verification actions
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-actions">
                <Link
                  to="/verification/queue"
                  className="dashboard-action"
                >
                  <span>
                    Open verification queue
                  </span>

                  <span>→</span>
                </Link>

                <Link
                  to="/verification/scheduled"
                  className="dashboard-action"
                >
                  <span>
                    View scheduled visits
                  </span>

                  <span>→</span>
                </Link>

                <Link
                  to="/verification/completed"
                  className="dashboard-action"
                >
                  <span>
                    View completed work
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
              <span>VERIFICATION STANDARD</span>

              <h2>
                Inspect. Document. Decide.
              </h2>
            </div>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-empty">
              <strong>
                Complete every assigned inspection
                through the verification workflow.
              </strong>

              <p>
                Verification results, checklist data,
                supporting photos and notes are submitted
                through the connected verification service.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}