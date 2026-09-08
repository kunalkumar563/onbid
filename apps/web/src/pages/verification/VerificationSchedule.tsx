import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { verificationService } from "../../services/verification";
import { ApiError } from "../../services/api/client";

export default function VerificationSchedule() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [scheduledAt, setScheduledAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [id]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!id) {
      setError("Verification request ID is missing.");
      return;
    }

    if (!scheduledAt) {
      setError("Please select a verification date and time.");
      return;
    }

    const selectedDate = new Date(scheduledAt);

    if (Number.isNaN(selectedDate.getTime())) {
      setError("Please select a valid date and time.");
      return;
    }

    if (selectedDate.getTime() <= Date.now()) {
      setError(
        "Verification must be scheduled for a future date and time.",
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await verificationService.schedule(id, {
        scheduledAt: selectedDate.toISOString(),
      });

      navigate(`/verification/requests/${id}`, {
        replace: true,
      });
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError(
          "Unable to schedule this verification request.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="verifier">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              VERIFICATION WORKFLOW
            </span>

            <h1>
              Schedule
              <br />
              <em>inspection.</em>
            </h1>
          </div>

          <p>
            Select a future date and time for the physical
            verification appointment.
          </p>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>REQUEST</span>

              <h2>
                {id ?? "Unknown request"}
              </h2>
            </div>

            <Link
              to={
                id
                  ? `/verification/requests/${id}`
                  : "/verification/queue"
              }
              className="dashboard-panel-link"
            >
              Back
            </Link>
          </div>

          <div className="dashboard-panel-body">
            <form
              onSubmit={handleSubmit}
              className="dashboard-form"
            >
              <div className="dashboard-field">
                <label htmlFor="verification-scheduled-at">
                  Verification date & time
                </label>

                <input
                  id="verification-scheduled-at"
                  name="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(event) => {
                    setScheduledAt(event.target.value);
                    setError(null);
                  }}
                  disabled={isSubmitting}
                  required
                />

                <small>
                  Choose a future appointment time.
                </small>
              </div>

              {error && (
                <div
                  className="password-error"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <div className="dashboard-actions">
                <Link
                  to={
                    id
                      ? `/verification/requests/${id}`
                      : "/verification/queue"
                  }
                  className="dashboard-action"
                >
                  <span>
                    Cancel
                  </span>

                  <span>←</span>
                </Link>

                <button
                  type="submit"
                  className="dashboard-action"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  <span>
                    {isSubmitting
                      ? "Scheduling..."
                      : "Schedule verification"}
                  </span>

                  <span>
                    →
                  </span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}