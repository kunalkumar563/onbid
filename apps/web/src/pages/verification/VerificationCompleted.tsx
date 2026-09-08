import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  verificationService,
  type VerificationRequest,
} from "../../services/verification";
import { ApiError } from "../../services/api/client";

export default function VerificationCompleted() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompleted = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await verificationService.getMyQueue();

      setRequests(
        response.requests.filter(
          (request) =>
            request.status === "passed" ||
            request.status === "failed",
        ),
      );
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError(
          "Unable to load completed verification work.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCompleted();
  }, [loadCompleted]);

  const passedCount = useMemo(
    () =>
      requests.filter(
        (request) => request.status === "passed",
      ).length,
    [requests],
  );

  const failedCount = useMemo(
    () =>
      requests.filter(
        (request) => request.status === "failed",
      ).length,
    [requests],
  );

  return (
    <DashboardLayout role="verifier">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              VERIFIER WORKSPACE
            </span>

            <h1>
              Completed
              <br />
              <em>work.</em>
            </h1>
          </div>

          <p>
            Review inspections you have completed, including
            passed and failed verification decisions and their
            submitted evidence.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Completed</span>

            <strong>
              {isLoading ? "—" : requests.length}
            </strong>

            <small>
              Verification requests completed
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Passed</span>

            <strong>
              {isLoading ? "—" : passedCount}
            </strong>

            <small>
              Listings that passed verification
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Failed</span>

            <strong>
              {isLoading ? "—" : failedCount}
            </strong>

            <small>
              Listings that failed verification
            </small>
          </article>
        </section>

        {error && (
          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Completed work unavailable
                </strong>

                <p>{error}</p>

                <button
                  type="button"
                  className="dashboard-action"
                  onClick={() =>
                    void loadCompleted()
                  }
                >
                  <span>
                    Try again
                  </span>

                  <span>↻</span>
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>
                VERIFICATION HISTORY
              </span>

              <h2>
                Completed inspections
              </h2>
            </div>

            <button
              type="button"
              className="dashboard-panel-link"
              onClick={() =>
                void loadCompleted()
              }
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : "Refresh"}
            </button>
          </div>

          <div className="dashboard-panel-body">
            {isLoading ? (
              <div className="dashboard-loading">
                Loading completed verification work
              </div>
            ) : requests.length === 0 ? (
              <div className="dashboard-empty">
                <strong>
                  No completed verification work
                </strong>

                <p>
                  Passed and failed verification requests
                  will appear here after completion.
                </p>

                <Link
                  to="/verification/queue"
                  className="dashboard-action"
                >
                  <span>
                    Open verification queue
                  </span>

                  <span>→</span>
                </Link>
              </div>
            ) : (
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Request</th>
                      <th>Listing</th>
                      <th>Verdict</th>
                      <th>Completed</th>
                      <th>Action</th>
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
                                  : "danger"
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>

                          <td>
                            {request.completedAt
                              ? new Date(
                                  request.completedAt,
                                ).toLocaleString()
                              : "Not available"}
                          </td>

                          <td>
                            <Link
                              to={`/verification/requests/${request.id}`}
                              className="dashboard-action"
                            >
                              <span>
                                View
                              </span>

                              <span>→</span>
                            </Link>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>
                VERIFICATION STANDARD
              </span>

              <h2>
                Inspect. Document. Decide.
              </h2>
            </div>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-empty">
              <strong>
                Completed inspections remain part
                of the verification record.
              </strong>

              <p>
                Verification verdicts, checklist data,
                supporting photos and notes are retained
                through the verification workflow.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}