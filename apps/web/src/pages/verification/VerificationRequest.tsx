import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  verificationService,
  type VerificationRequest as VerificationRequestData,
} from "../../services/verification";
import { ApiError } from "../../services/api/client";

export default function VerificationRequest() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] =
    useState<VerificationRequestData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadRequest = useCallback(async () => {
    if (!id) {
      setError("Verification request ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      /*
       * The current PRD exposes the verifier queue,
       * schedule and completion endpoints.
       *
       * It does not define a separate
       * GET /verifiers/requests/:id endpoint.
       *
       * Therefore we load the authenticated verifier's
       * queue and locate the requested record locally.
       */
      const response =
        await verificationService.getMyQueue();

      const matchedRequest =
        response.requests.find(
          (item) => item.id === id,
        );

      if (!matchedRequest) {
        setError(
          "This verification request was not found in your queue.",
        );
        setRequest(null);
        return;
      }

      setRequest(matchedRequest);
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError(
          "Unable to load the verification request.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  if (isLoading) {
    return (
      <DashboardLayout role="verifier">
        <div className="dashboard-page">
          <div className="dashboard-loading">
            Loading verification request...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !request) {
    return (
      <DashboardLayout role="verifier">
        <div className="dashboard-page">
          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Verification request unavailable
                </strong>

                <p>
                  {error ??
                    "The requested verification record could not be loaded."}
                </p>

                <div className="dashboard-actions">
                  <button
                    type="button"
                    className="dashboard-action"
                    onClick={() =>
                      void loadRequest()
                    }
                  >
                    <span>
                      Try again
                    </span>

                    <span>↻</span>
                  </button>

                  <Link
                    to="/verification/queue"
                    className="dashboard-action"
                  >
                    <span>
                      Back to queue
                    </span>

                    <span>←</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="verifier">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              VERIFICATION REQUEST
            </span>

            <h1>
              Request
              <br />
              <em>details.</em>
            </h1>
          </div>

          <p>
            {user?.fullName
              ? `Verifier: ${user.fullName}`
              : "Review the assigned verification request."}
          </p>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>
                REQUEST
              </span>

              <h2>
                {request.id}
              </h2>
            </div>

            <span
              className={`dashboard-status ${
                request.status === "passed"
                  ? "success"
                  : request.status === "failed"
                    ? "danger"
                    : request.status === "scheduled"
                      ? "warning"
                      : "neutral"
              }`}
            >
              {request.status.replace(
                "_",
                " ",
              )}
            </span>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-detail-grid">
              <div>
                <span>
                  LISTING ID
                </span>

                <strong>
                  {request.listingId}
                </strong>
              </div>

              <div>
                <span>
                  VERIFIER
                </span>

                <strong>
                  {request.verifierId ??
                    "Assigned verifier"}
                </strong>
              </div>

              <div>
                <span>
                  CREATED
                </span>

                <strong>
                  {new Date(
                    request.createdAt,
                  ).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>
                  SCHEDULED
                </span>

                <strong>
                  {request.scheduledAt
                    ? new Date(
                        request.scheduledAt,
                      ).toLocaleString()
                    : "Not scheduled"}
                </strong>
              </div>

              <div>
                <span>
                  COMPLETED
                </span>

                <strong>
                  {request.completedAt
                    ? new Date(
                        request.completedAt,
                      ).toLocaleString()
                    : "Not completed"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  CHECKLIST
                </span>

                <h2>
                  Inspection data
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              {request.checklist &&
              Object.keys(request.checklist).length > 0 ? (
                <div className="dashboard-detail-list">
                  {Object.entries(
                    request.checklist,
                  ).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="dashboard-detail-row"
                      >
                        <span>
                          {key}
                        </span>

                        <strong>
                          {typeof value ===
                          "object"
                            ? JSON.stringify(
                                value,
                              )
                            : String(value)}
                        </strong>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="dashboard-empty">
                  <strong>
                    No checklist submitted
                  </strong>

                  <p>
                    Inspection checklist information
                    will appear after verification is
                    completed.
                  </p>
                </div>
              )}
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  PHOTOS
                </span>

                <h2>
                  Verification evidence
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              {request.photos &&
              request.photos.length > 0 ? (
                <div className="dashboard-photo-grid">
                  {request.photos.map(
                    (photo) => (
                      <a
                        key={photo}
                        href={photo}
                        target="_blank"
                        rel="noreferrer"
                        className="dashboard-photo"
                      >
                        <img
                          src={photo}
                          alt="Verification evidence"
                        />
                      </a>
                    ),
                  )}
                </div>
              ) : (
                <div className="dashboard-empty">
                  <strong>
                    No verification photos
                  </strong>

                  <p>
                    Supporting verification photos have
                    not been submitted.
                  </p>
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>
                NOTES
              </span>

              <h2>
                Verifier notes
              </h2>
            </div>
          </div>

          <div className="dashboard-panel-body">
            {request.notes ? (
              <p className="dashboard-notes">
                {request.notes}
              </p>
            ) : (
              <div className="dashboard-empty">
                <strong>
                  No notes submitted
                </strong>

                <p>
                  No additional verifier notes are
                  available for this request.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-body">
            <div className="dashboard-actions">
              <Link
                to="/verification/queue"
                className="dashboard-action"
              >
                <span>
                  Back to verification queue
                </span>

                <span>←</span>
              </Link>

              {request.status === "pending" && (
                <button
                  type="button"
                  className="dashboard-action"
                  onClick={() =>
                    navigate(
                      `/verification/requests/${request.id}/schedule`,
                    )
                  }
                >
                  <span>
                    Schedule verification
                  </span>

                  <span>→</span>
                </button>
              )}

              {request.status === "scheduled" && (
                <button
                  type="button"
                  className="dashboard-action"
                  onClick={() =>
                    navigate(
                      `/verification/requests/${request.id}/complete`,
                    )
                  }
                >
                  <span>
                    Complete verification
                  </span>

                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}