import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  verificationService,
  type VerificationRequest,
} from "../../services/verification";
import { ApiError } from "../../services/api/client";

export default function VerificationScheduled() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadScheduled = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await verificationService.getMyQueue();

      setRequests(
        response.requests.filter(
          (request) => request.status === "scheduled",
        ),
      );
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError("Unable to load scheduled verification visits.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadScheduled();
  }, [loadScheduled]);

  const upcomingRequests = useMemo(
    () =>
      [...requests].sort((a, b) => {
        const first = a.scheduledAt
          ? new Date(a.scheduledAt).getTime()
          : Number.MAX_SAFE_INTEGER;

        const second = b.scheduledAt
          ? new Date(b.scheduledAt).getTime()
          : Number.MAX_SAFE_INTEGER;

        return first - second;
      }),
    [requests],
  );

  const upcomingCount = useMemo(
    () =>
      upcomingRequests.filter((request) => {
        if (!request.scheduledAt) {
          return false;
        }

        return (
          new Date(request.scheduledAt).getTime() >=
          Date.now()
        );
      }).length,
    [upcomingRequests],
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
              Scheduled
              <br />
              <em>visits.</em>
            </h1>
          </div>

          <p>
            Review your scheduled verification visits,
            inspect the assigned listings and complete each
            verification through the inspection workflow.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Scheduled</span>

            <strong>
              {isLoading ? "—" : requests.length}
            </strong>

            <small>
              Verification visits currently scheduled
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Upcoming</span>

            <strong>
              {isLoading ? "—" : upcomingCount}
            </strong>

            <small>
              Visits scheduled for the future
            </small>
          </article>
        </section>

        {error && (
          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Scheduled visits unavailable
                </strong>

                <p>{error}</p>

                <button
                  type="button"
                  className="dashboard-action"
                  onClick={() => void loadScheduled()}
                >
                  <span>Try again</span>
                  <span>↻</span>
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>VERIFICATION CALENDAR</span>

              <h2>
                Scheduled inspections
              </h2>
            </div>

            <button
              type="button"
              className="dashboard-panel-link"
              onClick={() => void loadScheduled()}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="dashboard-panel-body">
            {isLoading ? (
              <div className="dashboard-loading">
                Loading scheduled visits
              </div>
            ) : upcomingRequests.length === 0 ? (
              <div className="dashboard-empty">
                <strong>
                  No scheduled verification visits
                </strong>

                <p>
                  Scheduled inspections assigned to you
                  will appear here.
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
                      <th>Scheduled for</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {upcomingRequests.map(
                      (request) => (
                        <tr key={request.id}>
                          <td>{request.id}</td>

                          <td>
                            {request.listingId}
                          </td>

                          <td>
                            {request.scheduledAt
                              ? new Date(
                                  request.scheduledAt,
                                ).toLocaleString()
                              : "Not scheduled"}
                          </td>

                          <td>
                            <Link
                              to={`/verification/requests/${request.id}`}
                              className="dashboard-action"
                            >
                              <span>Open</span>
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
              <span>WORKFLOW</span>

              <h2>
                Continue verification
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
        </section>
      </div>
    </DashboardLayout>
  );
}