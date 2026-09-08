import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { verificationService } from "../../services/verification";
import { ApiError } from "../../services/api/client";

type Verdict = "passed" | "failed";

type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
};

const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: "condition",
    label: "Item condition matches the listing",
    checked: false,
  },
  {
    id: "authenticity",
    label: "Item appears authentic",
    checked: false,
  },
  {
    id: "description",
    label: "Description matches the physical item",
    checked: false,
  },
  {
    id: "photos",
    label: "Listing photos match the physical item",
    checked: false,
  },
  {
    id: "functionality",
    label: "Relevant functionality has been inspected",
    checked: false,
  },
];

export default function VerificationComplete() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const [verdict, setVerdict] =
    useState<Verdict | null>(null);

  const [checklist, setChecklist] =
    useState<ChecklistItem[]>(
      INITIAL_CHECKLIST,
    );

  const [photos, setPhotos] =
    useState<string[]>([]);

  const [photoInput, setPhotoInput] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const toggleChecklistItem = (
    itemId: string,
  ) => {
    setChecklist((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              checked: !item.checked,
            }
          : item,
      ),
    );

    setError(null);
  };

  const addPhoto = () => {
    const trimmedPhoto =
      photoInput.trim();

    if (!trimmedPhoto) {
      setError(
        "Enter a photo URL before adding it.",
      );
      return;
    }

    try {
      const parsedUrl =
        new URL(trimmedPhoto);

      if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
      ) {
        throw new Error();
      }
    } catch {
      setError(
        "Please enter a valid photo URL.",
      );
      return;
    }

    if (photos.includes(trimmedPhoto)) {
      setError(
        "This photo has already been added.",
      );
      return;
    }

    setPhotos((current) => [
      ...current,
      trimmedPhoto,
    ]);

    setPhotoInput("");
    setError(null);
  };

  const removePhoto = (
    photoToRemove: string,
  ) => {
    setPhotos((current) =>
      current.filter(
        (photo) =>
          photo !== photoToRemove,
      ),
    );
  };

  const handlePhotoKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addPhoto();
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!id) {
      setError(
        "Verification request ID is missing.",
      );
      return;
    }

    if (!verdict) {
      setError(
        "Please select a verification verdict.",
      );
      return;
    }

    const uncheckedItems =
      checklist.filter(
        (item) => !item.checked,
      );

    if (uncheckedItems.length > 0) {
      setError(
        "Please complete every checklist item before submitting the verification.",
      );
      return;
    }

    if (photos.length === 0) {
      setError(
        "At least one verification photo is required.",
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const checklistPayload =
      checklist.reduce<
        Record<string, unknown>
      >((result, item) => {
        result[item.id] = item.checked;
        return result;
      }, {});

    try {
      await verificationService.complete(
        id,
        {
          verdict,
          checklist: checklistPayload,
          photos,
          ...(notes.trim()
            ? {
                notes: notes.trim(),
              }
            : {}),
        },
      );

      navigate(
        `/verification/requests/${id}`,
        {
          replace: true,
        },
      );
    } catch (requestError) {
      if (
        requestError instanceof ApiError
      ) {
        setError(
          requestError.message,
        );
      } else {
        setError(
          "Unable to complete this verification request.",
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
              Complete
              <br />
              <em>inspection.</em>
            </h1>
          </div>

          <p>
            Record the physical inspection,
            supporting evidence and final
            verification verdict.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
        >
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  REQUEST
                </span>

                <h2>
                  {id ??
                    "Unknown request"}
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
              <div className="dashboard-verdict">
                <span className="dashboard-field-label">
                  FINAL VERDICT
                </span>

                <div className="dashboard-verdict-options">
                  <button
                    type="button"
                    className={
                      verdict === "passed"
                        ? "dashboard-verdict-option active"
                        : "dashboard-verdict-option"
                    }
                    onClick={() => {
                      setVerdict(
                        "passed",
                      );
                      setError(null);
                    }}
                    disabled={
                      isSubmitting
                    }
                  >
                    <strong>
                      PASS
                    </strong>

                    <span>
                      Item is suitable
                      for auction.
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      verdict === "failed"
                        ? "dashboard-verdict-option active"
                        : "dashboard-verdict-option"
                    }
                    onClick={() => {
                      setVerdict(
                        "failed",
                      );
                      setError(null);
                    }}
                    disabled={
                      isSubmitting
                    }
                  >
                    <strong>
                      FAIL
                    </strong>

                    <span>
                      Item does not meet
                      verification requirements.
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  INSPECTION
                </span>

                <h2>
                  Verification checklist
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-checklist">
                {checklist.map(
                  (item) => (
                    <label
                      key={item.id}
                      className={
                        item.checked
                          ? "dashboard-checklist-item checked"
                          : "dashboard-checklist-item"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          item.checked
                        }
                        onChange={() =>
                          toggleChecklistItem(
                            item.id,
                          )
                        }
                        disabled={
                          isSubmitting
                        }
                      />

                      <span>
                        {item.label}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  EVIDENCE
                </span>

                <h2>
                  Verification photos
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-field">
                <label htmlFor="verification-photo">
                  Photo URL
                </label>

                <div className="dashboard-input-row">
                  <input
                    id="verification-photo"
                    type="url"
                    value={
                      photoInput
                    }
                    onChange={(
                      event: ChangeEvent<HTMLInputElement>,
                    ) => {
                      setPhotoInput(
                        event.target.value,
                      );
                      setError(null);
                    }}
                    onKeyDown={
                      handlePhotoKeyDown
                    }
                    placeholder="https://..."
                    disabled={
                      isSubmitting
                    }
                  />

                  <button
                    type="button"
                    className="dashboard-action"
                    onClick={
                      addPhoto
                    }
                    disabled={
                      isSubmitting
                    }
                  >
                    <span>
                      Add photo
                    </span>

                    <span>
                      +
                    </span>
                  </button>
                </div>

                <small>
                  Add the URLs of the supporting
                  verification photographs.
                </small>
              </div>

              {photos.length > 0 && (
                <div className="dashboard-photo-list">
                  {photos.map(
                    (photo) => (
                      <div
                        key={photo}
                        className="dashboard-photo-item"
                      >
                        <a
                          href={photo}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {photo}
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            removePhoto(
                              photo,
                            )
                          }
                          disabled={
                            isSubmitting
                          }
                          aria-label="Remove photo"
                        >
                          Remove
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  NOTES
                </span>

                <h2>
                  Inspection notes
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-field">
                <label htmlFor="verification-notes">
                  Notes
                </label>

                <textarea
                  id="verification-notes"
                  name="notes"
                  value={notes}
                  onChange={(
                    event,
                  ) => {
                    setNotes(
                      event.target.value,
                    );
                    setError(null);
                  }}
                  placeholder="Add relevant observations from the physical inspection..."
                  rows={6}
                  disabled={
                    isSubmitting
                  }
                />

                <small>
                  Keep notes factual and relevant
                  to the inspection.
                </small>
              </div>
            </div>
          </section>

          {error && (
            <div
              className="password-error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
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

                  <span>
                    ←
                  </span>
                </Link>

                <button
                  type="submit"
                  className="dashboard-action"
                  disabled={
                    isSubmitting
                  }
                  aria-busy={
                    isSubmitting
                  }
                >
                  <span>
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit verification"}
                  </span>

                  <span>
                    →
                  </span>
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </DashboardLayout>
  );
}