import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  verificationService,
  type VerificationRequest,
} from "../../services/verification";
import { ApiError } from "../../services/api/client";

export default function VerificationQueue() {
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

  return (
    <DashboardLayout role="verifier">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              VERIFICATION QUEUE
            </span>

            <h1>
              Assigned
              <br />
              <em>requests.</em>
            </h1>
          </div>

          <p>
            {user?.fullName
              ? `Welcome, ${user.fullName}.`
              : "Review your assigned verification requests."}
          </p>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>
                VERIFIER WORKFLOW
              </span>

              <h2>
                Verification requests
              </h2>
            </div>

            <button
              type="button"
              className="dashboard-panel-link"
              onClick={() =>
                void loadQueue()
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
                Loading verification queue...
              </div>
            ) : error ? (
              <div className="dashboard-empty">
                <strong>
                  Unable to load queue
                </strong>

                <p>{error}</p>

                <button
                  type="button"
                  className="dashboard-action"
                  onClick={() =>
                    void loadQueue()
                  }
                >
                  <span>
                    Try again
                  </span>

                  <span>↻</span>
                </button>
              </div>
            ) : requests.length === 0 ? (
              <div className="dashboard-empty">
                <strong>
                  No assigned requests
                </strong>

                <p>
                  There are currently no verification
                  requests assigned to your account.
                </p>
              </div>
            ) : (
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>
                        Request
                      </th>

                      <th>
                        Listing
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Scheduled
                      </th>

                      <th>
                        Created
                      </th>

                      <th>
                        Action
                      </th>
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

                          <td>
                            {new Date(
                              request.createdAt,
                            ).toLocaleString()}
                          </td>

                          <td>
                            <Link
                              to={`/verification/requests/${request.id}`}
                              className="dashboard-panel-link"
                            >
                              View
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
      </div>
    </DashboardLayout>
  );
}