import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { listingService } from "../../services/listing";
import type {
  Listing,
  ListingStatus,
} from "../../types/listing";
import { ApiError } from "../../services/api/client";
import {
  getCategoryLabel,
  getSubCategoryLabel,
  getSubSubCategoryLabel,
} from "../../config/categories";

const STATUS_LABELS: Record<
  ListingStatus,
  string
> = {
  draft: "Draft",
  pending_verification:
    "Pending verification",
  verified: "Verified",
  rejected: "Rejected",
  active: "Active auction",
  ended: "Auction ended",
  sold: "Sold",
  cancelled: "Cancelled",
};

function statusClass(
  status: ListingStatus,
): string {
  switch (status) {
    case "verified":
    case "active":
    case "sold":
      return "success";

    case "pending_verification":
      return "warning";

    case "rejected":
    case "cancelled":
      return "danger";

    default:
      return "neutral";
  }
}

function formatPrice(
  amount: number,
): string {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(amount);
}

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "—";
  }

  return date.toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );
}

export default function ListingDetail() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const [listing, setListing] =
    useState<Listing | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isRequestingVerification,
    setIsRequestingVerification,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadListing =
    useCallback(async () => {
      if (!id) {
        setError(
          "Listing ID is missing.",
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response =
          await listingService.getById(id);

        setListing(response);
      } catch (requestError) {
        if (
          requestError instanceof ApiError
        ) {
          setError(
            requestError.message,
          );
        } else {
          setError(
            "Unable to load this listing.",
          );
        }

        setListing(null);
      } finally {
        setIsLoading(false);
      }
    }, [id]);

  useEffect(() => {
    void loadListing();
  }, [loadListing]);

  const handleRequestVerification =
    async () => {
      if (!listing) {
        return;
      }

      setIsRequestingVerification(
        true,
      );
      setError(null);

      try {
        const updatedListing =
          await listingService.requestVerification(
            listing.id,
          );

        setListing(
          updatedListing,
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
            "Unable to request verification.",
          );
        }
      } finally {
        setIsRequestingVerification(
          false,
        );
      }
    };

  if (isLoading) {
    return (
      <DashboardLayout role="seller">
        <div className="dashboard-page">
          <div className="dashboard-loading">
            Loading listing...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!listing) {
    return (
      <DashboardLayout role="seller">
        <div className="dashboard-page">
          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Listing unavailable
                </strong>

                <p>
                  {error ??
                    "The requested listing could not be loaded."}
                </p>

                <div className="dashboard-actions">
                  <button
                    type="button"
                    className="dashboard-action"
                    onClick={() =>
                      void loadListing()
                    }
                  >
                    <span>
                      Try again
                    </span>

                    <span>
                      ↻
                    </span>
                  </button>

                  <Link
                    to="/my-listings"
                    className="dashboard-action"
                  >
                    <span>
                      Back to listings
                    </span>

                    <span>
                      ←
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout>
    );
  }

  const canEdit =
    listing.status === "draft" ||
    listing.status === "rejected";

  const canRequestVerification =
    listing.status === "draft";

  const categoryName =
    getCategoryLabel(
      listing.category,
    );

  const subCategoryName =
    listing.subCategory
      ? getSubCategoryLabel(
          listing.category,
          listing.subCategory,
        )
      : "Not specified";

  const subSubCategoryName =
    listing.subSubCategory
      ? getSubSubCategoryLabel(
          listing.subCategory,
          listing.subSubCategory,
        )
      : "Not specified";

  return (
    <DashboardLayout role="seller">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              SELLER LISTING
            </span>

            <h1>
              Listing
              <br />
              <em>details.</em>
            </h1>
          </div>

          <p>
            Review your item information,
            verification status and auction
            readiness.
          </p>
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
          <div className="dashboard-panel-header">
            <div>
              <span>
                LISTING
              </span>

              <h2>
                {listing.title}
              </h2>
            </div>

            <span
              className={`dashboard-status ${statusClass(
                listing.status,
              )}`}
            >
              {
                STATUS_LABELS[
                  listing.status
                ]
              }
            </span>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-detail-grid">
              <div>
                <span>
                  CATEGORY
                </span>

                <strong>
                  {categoryName}
                </strong>
              </div>

              <div>
                <span>
                  SUB-CATEGORY
                </span>

                <strong>
                  {subCategoryName}
                </strong>
              </div>

              <div>
                <span>
                  SUB-SUB-CATEGORY
                </span>

                <strong>
                  {subSubCategoryName}
                </strong>
              </div>

              <div>
                <span>
                  STARTING PRICE
                </span>

                <strong>
                  {formatPrice(
                    listing.startingPrice,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  AUCTION DURATION
                </span>

                <strong>
                  {listing.auctionDuration}{" "}
                  days
                </strong>
              </div>

              <div>
                <span>
                  SELLER LOCATION
                </span>

                <strong>
                  {listing.sellerLocation}
                </strong>
              </div>

              <div>
                <span>
                  CREATED
                </span>

                <strong>
                  {formatDate(
                    listing.createdAt,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  LAST UPDATED
                </span>

                <strong>
                  {formatDate(
                    listing.updatedAt,
                  )}
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
                  DESCRIPTION
                </span>

                <h2>
                  Item information
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <p className="dashboard-notes">
                {listing.description}
              </p>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  VERIFICATION
                </span>

                <h2>
                  Verification status
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-detail-list">
                <div className="dashboard-detail-row">
                  <span>
                    Status
                  </span>

                  <strong>
                    {listing.verificationStatus ??
                      "Not requested"}
                  </strong>
                </div>

                <div className="dashboard-detail-row">
                  <span>
                    Request ID
                  </span>

                  <strong>
                    {listing.verificationRequestId ??
                      "Not available"}
                  </strong>
                </div>
              </div>

              {canRequestVerification && (
                <div className="dashboard-actions">
                  <button
                    type="button"
                    className="dashboard-action"
                    onClick={
                      handleRequestVerification
                    }
                    disabled={
                      isRequestingVerification
                    }
                    aria-busy={
                      isRequestingVerification
                    }
                  >
                    <span>
                      {isRequestingVerification
                        ? "Requesting..."
                        : "Request verification"}
                    </span>

                    <span>
                      →
                    </span>
                  </button>
                </div>
              )}

              {listing.status ===
                "pending_verification" && (
                <div className="dashboard-empty">
                  <strong>
                    Verification pending
                  </strong>

                  <p>
                    Your listing has been
                    submitted for physical
                    verification.
                  </p>
                </div>
              )}

              {listing.verificationStatus ===
                "passed" && (
                <div className="dashboard-empty">
                  <strong>
                    Verification passed
                  </strong>

                  <p>
                    This listing has
                    successfully passed
                    verification.
                  </p>
                </div>
              )}

              {listing.verificationStatus ===
                "failed" && (
                <div className="dashboard-empty">
                  <strong>
                    Verification failed
                  </strong>

                  <p>
                    Review the verifier
                    feedback before submitting
                    the item again.
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
                PHOTOGRAPHS
              </span>

              <h2>
                Listing media
              </h2>
            </div>

            <span>
              {listing.photos.length}{" "}
              {listing.photos.length === 1
                ? "photo"
                : "photos"}
            </span>
          </div>

          <div className="dashboard-panel-body">
            {listing.photos.length ===
            0 ? (
              <div className="dashboard-empty">
                <strong>
                  No photographs
                </strong>

                <p>
                  This listing does not
                  currently contain any
                  photographs.
                </p>
              </div>
            ) : (
              <div className="dashboard-photo-grid">
                {listing.photos.map(
                  (photo, index) => (
                    <a
                      key={photo}
                      href={photo}
                      target="_blank"
                      rel="noreferrer"
                      className="dashboard-photo"
                    >
                      <img
                        src={photo}
                        alt={`${listing.title} photo ${
                          index + 1
                        }`}
                        loading="lazy"
                      />
                    </a>
                  ),
                )}
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-body">
            <div className="dashboard-actions">
              <Link
                to="/my-listings"
                className="dashboard-action"
              >
                <span>
                  Back to my listings
                </span>

                <span>
                  ←
                </span>
              </Link>

              {canEdit && (
                <Link
                  to={`/listings/${listing.id}/edit`}
                  className="dashboard-action"
                >
                  <span>
                    Edit listing
                  </span>

                  <span>
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}