import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { listingService } from "../../services/listing";
import type {
  Listing,
  ListingStatus,
} from "../../types/listing";
import { ApiError } from "../../services/api/client";

const STATUS_LABELS: Record<
  ListingStatus,
  string
> = {
  draft: "Draft",
  pending_verification: "Pending verification",
  verified: "Verified",
  rejected: "Rejected",
  active: "Active auction",
  ended: "Auction ended",
  sold: "Sold",
  cancelled: "Cancelled",
};

function getStatusClass(
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

function formatCategory(
  category: Listing["category"],
): string {
  return category
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
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

export default function MyListings() {
  const [listings, setListings] =
    useState<Listing[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadListings =
    useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await listingService.getMyListings();

        setListings(
          response.listings,
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
            "Unable to load your listings.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  return (
    <DashboardLayout role="seller">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              SELLER WORKSPACE
            </span>

            <h1>
              My
              <br />
              <em>listings.</em>
            </h1>
          </div>

          <p>
            Create, manage and submit your items
            for physical verification.
          </p>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>
                COLLECTION
              </span>

              <h2>
                Your listings
              </h2>
            </div>

            <div className="dashboard-actions">
              <button
                type="button"
                className="dashboard-panel-link"
                onClick={() =>
                  void loadListings()
                }
                disabled={isLoading}
              >
                {isLoading
                  ? "Loading..."
                  : "Refresh"}
              </button>

              <Link
                to="/listings/create"
                className="dashboard-panel-link"
              >
                Create listing
              </Link>
            </div>
          </div>

          <div className="dashboard-panel-body">
            {isLoading ? (
              <div className="dashboard-loading">
                Loading your listings...
              </div>
            ) : error ? (
              <div className="dashboard-empty">
                <strong>
                  Unable to load listings
                </strong>

                <p>
                  {error}
                </p>

                <button
                  type="button"
                  className="dashboard-action"
                  onClick={() =>
                    void loadListings()
                  }
                >
                  <span>
                    Try again
                  </span>

                  <span>
                    ↻
                  </span>
                </button>
              </div>
            ) : listings.length === 0 ? (
              <div className="dashboard-empty">
                <strong>
                  Your collection is empty
                </strong>

                <p>
                  Create your first listing to
                  start the OnBid verification and
                  auction journey.
                </p>

                <Link
                  to="/listings/create"
                  className="dashboard-action"
                >
                  <span>
                    Create your first listing
                  </span>

                  <span>
                    →
                  </span>
                </Link>
              </div>
            ) : (
              <div className="listing-grid">
                {listings.map(
                  (listing) => (
                    <article
                      key={listing.id}
                      className="listing-card"
                    >
                      <div className="listing-card-image">
                        {(listing.photos?.length || 0) >
                        0 ? (
                          <img
                            src={
                              listing.photos[0]
                            }
                            alt={
                              listing.title
                            }
                            loading="lazy"
                          />
                        ) : (
                          <div className="listing-card-no-image">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="listing-card-content">
                        <div className="listing-card-top">
                          <span>
                            {formatCategory(
                              listing.category,
                            )}
                          </span>

                          <span
                            className={`dashboard-status ${getStatusClass(
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

                        <h3>
                          {listing.title}
                        </h3>

                        <p>
                          {listing.description}
                        </p>

                        <div className="listing-card-meta">
                          <div>
                            <span>
                              Starting price
                            </span>

                            <strong>
                              {formatPrice(
                                listing.startingPrice,
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Duration
                            </span>

                            <strong>
                              {
                                listing.auctionDuration
                              }{" "}
                              days
                            </strong>
                          </div>
                        </div>

                        <div className="listing-card-actions">
                          <Link
                            to={`/listings/${listing.id}`}
                            className="dashboard-action"
                          >
                            <span>
                              View listing
                            </span>

                            <span>
                              →
                            </span>
                          </Link>

                          {(listing.status ===
                            "draft" ||
                            listing.status ===
                              "rejected") && (
                            <Link
                              to={`/listings/${listing.id}/edit`}
                              className="listing-secondary-action"
                            >
                              Edit
                            </Link>
                          )}

                          {listing.status ===
                            "draft" && (
                            <Link
                              to={`/listings/${listing.id}`}
                              className="listing-secondary-action"
                            >
                              Request verification
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}