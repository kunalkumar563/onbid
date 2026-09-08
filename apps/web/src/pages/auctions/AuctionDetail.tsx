import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  getCategoryLabel,
  getSubCategoryLabel,
  getSubSubCategoryLabel,
} from "../../config/categories";
import { biddingService } from "../../services/bidding";
import type {
  Bid,
} from "../../services/bidding";
import type { Auction } from "../../types/auction";
import { api, ApiError } from "../../services/api/client";

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

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusClass(
  status: Auction["status"],
): string {
  switch (status) {
    case "live":
      return "success";

    case "scheduled":
    case "pending":
      return "warning";

    case "ended":
    case "cancelled":
      return "danger";

    default:
      return "neutral";
  }
}

function formatStatus(
  status: Auction["status"],
): string {
  return status
    .replace("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function getRemainingTime(
  endsAt: string,
): string {
  const remaining =
    new Date(endsAt).getTime() -
    Date.now();

  if (remaining <= 0) {
    return "Auction ended";
  }

  const totalSeconds =
    Math.floor(
      remaining / 1000,
    );

  const days =
    Math.floor(
      totalSeconds / 86400,
    );

  const hours =
    Math.floor(
      (totalSeconds % 86400) /
        3600,
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60,
    );

  const seconds =
    totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  return `${hours}h ${minutes}m ${seconds}s`;
}

type AuctionCategoryDetails = Auction & {
  subCategory?: string | null;
  subSubCategory?: string | null;
  description?: string | null;
  sellerLocation?: string | null;
  photos?: string[] | null;
};

function getCategoryHierarchy(
  auction: Auction,
) {
  const details =
    auction as AuctionCategoryDetails;

  const category = getCategoryLabel(
    auction.category,
  );

  const subCategory =
    details.subCategory
      ? getSubCategoryLabel(
          auction.category,
          details.subCategory,
        )
      : null;

  const subSubCategory =
    details.subSubCategory
      ? getSubSubCategoryLabel(
          auction.category,
          details.subCategory ?? "",
          details.subSubCategory,
        )
      : null;

  return {
    category,
    subCategory,
    subSubCategory,
  };
}

export default function AuctionDetail() {
  const { id } = useParams<{
    id: string;
  }>();

  const [auction, setAuction] =
    useState<Auction | null>(null);

  const [bids, setBids] =
    useState<Bid[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isLoadingBids, setIsLoadingBids] =
    useState(false);

  const [isUnlocking, setIsUnlocking] =
    useState(false);

  const [isBidding, setIsBidding] =
    useState(false);

  const [bidAmount, setBidAmount] =
    useState("");

  const [biddingUnlocked, setBiddingUnlocked] =
    useState(false);

  const [remainingTime, setRemainingTime] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [bidError, setBidError] =
    useState<string | null>(null);

  const loadAuction =
    useCallback(async () => {
      if (!id) {
        setError(
          "Auction ID is missing.",
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response =
          await api.get<Auction>(
            `/auctions/${id}`,
          );

        setAuction(response);
      } catch (requestError) {
        if (
          requestError instanceof ApiError
        ) {
          setError(
            requestError.message,
          );
        } else {
          setError(
            "Unable to load this auction.",
          );
        }

        setAuction(null);
      } finally {
        setIsLoading(false);
      }
    }, [id]);

  const loadBids =
    useCallback(async () => {
      if (!id) {
        return;
      }

      setIsLoadingBids(true);
      setBidError(null);

      try {
        const response =
          await biddingService.getBidHistory(
            id,
          );

        setBids(
          response.bids,
        );
      } catch (requestError) {
        if (
          requestError instanceof ApiError
        ) {
          setBidError(
            requestError.message,
          );
        } else {
          setBidError(
            "Unable to load bid history.",
          );
        }
      } finally {
        setIsLoadingBids(false);
      }
    }, [id]);

  useEffect(() => {
    void loadAuction();
    void loadBids();
  }, [
    loadAuction,
    loadBids,
  ]);

  useEffect(() => {
    if (!auction) {
      return;
    }

    const updateCountdown = () => {
      setRemainingTime(
        getRemainingTime(
          auction.endsAt,
        ),
      );
    };

    updateCountdown();

    const intervalId =
      window.setInterval(
        updateCountdown,
        1000,
      );

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [auction]);

  const minimumNextBid =
    useMemo(() => {
      if (!auction) {
        return 0;
      }

      return Math.max(
        auction.startingPrice,
        auction.currentBid +
          auction.minimumIncrement,
      );
    }, [auction]);

  const categoryDetails =
    useMemo(() => {
      if (!auction) {
        return null;
      }

      return getCategoryHierarchy(
        auction,
      );
    }, [auction]);

  const auctionExtended =
    auction as AuctionCategoryDetails | null;

  const handleUnlockBidding =
    async () => {
      if (!id) {
        return;
      }

      setIsUnlocking(true);
      setBidError(null);

      try {
        await biddingService.unlockBidding(
          id,
        );

        setBiddingUnlocked(true);
      } catch (requestError) {
        if (
          requestError instanceof ApiError
        ) {
          setBidError(
            requestError.message,
          );
        } else {
          setBidError(
            "Unable to unlock bidding.",
          );
        }
      } finally {
        setIsUnlocking(false);
      }
    };

  const handlePlaceBid =
    async () => {
      if (!id || !auction) {
        return;
      }

      const amount =
        Number(bidAmount);

      if (
        !Number.isFinite(amount) ||
        amount < minimumNextBid
      ) {
        setBidError(
          `Your bid must be at least ${formatPrice(
            minimumNextBid,
          )}.`,
        );
        return;
      }

      setIsBidding(true);
      setBidError(null);

      try {
        const createdBid =
          await biddingService.placeBid(
            id,
            {
              amount,
            },
          );

        setBids((current) => [
          createdBid,
          ...current,
        ]);

        setAuction((current) =>
          current
            ? {
                ...current,
                currentBid:
                  createdBid.amount,
              }
            : current,
        );

        setBidAmount("");
      } catch (requestError) {
        if (
          requestError instanceof ApiError
        ) {
          setBidError(
            requestError.message,
          );
        } else {
          setBidError(
            "Unable to place your bid.",
          );
        }
      } finally {
        setIsBidding(false);
      }
    };

  if (isLoading) {
    return (
      <DashboardLayout role="bidder">
        <div className="dashboard-page">
          <div className="dashboard-loading">
            Loading auction...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!auction) {
    return (
      <DashboardLayout role="bidder">
        <div className="dashboard-page">
          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Auction unavailable
                </strong>

                <p>
                  {error ??
                    "The requested auction could not be loaded."}
                </p>

                <div className="dashboard-actions">
                  <button
                    type="button"
                    className="dashboard-action"
                    onClick={() =>
                      void loadAuction()
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
                    to="/auctions"
                    className="dashboard-action"
                  >
                    <span>
                      Browse auctions
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

  const isLive =
    auction.status === "live";

  const isEnded =
    auction.status === "ended" ||
    remainingTime ===
      "Auction ended";

  return (
    <DashboardLayout role="bidder">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              ONBID AUCTION
            </span>

            <h1>
              {auction.title}
            </h1>
          </div>

          <p>
            Review the auction details,
            category, verification status
            and live bidding information.
          </p>
        </section>

        {error && (
          <div
            className="password-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>
                AUCTION STATUS
              </span>

              <h2>
                {formatStatus(
                  auction.status,
                )}
              </h2>
            </div>

            <span
              className={`dashboard-status ${getStatusClass(
                auction.status,
              )}`}
            >
              {formatStatus(
                auction.status,
              )}
            </span>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-detail-grid">
              <div>
                <span>
                  CURRENT BID
                </span>

                <strong>
                  {formatPrice(
                    auction.currentBid,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  STARTING PRICE
                </span>

                <strong>
                  {formatPrice(
                    auction.startingPrice,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  MINIMUM INCREMENT
                </span>

                <strong>
                  {formatPrice(
                    auction.minimumIncrement,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  TIME REMAINING
                </span>

                <strong>
                  {remainingTime}
                </strong>
              </div>

              <div>
                <span>
                  STARTS
                </span>

                <strong>
                  {formatDate(
                    auction.startsAt,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  ENDS
                </span>

                <strong>
                  {formatDate(
                    auction.endsAt,
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
                  ITEM DETAILS
                </span>

                <h2>
                  Category & verification
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-detail-list">
                <div className="dashboard-detail-row">
                  <span>
                    Category
                  </span>

                  <strong>
                    {categoryDetails?.category ??
                      "Not available"}
                  </strong>
                </div>

                {categoryDetails?.subCategory && (
                  <div className="dashboard-detail-row">
                    <span>
                      Subcategory
                    </span>

                    <strong>
                      {
                        categoryDetails.subCategory
                      }
                    </strong>
                  </div>
                )}

                {categoryDetails?.subSubCategory && (
                  <div className="dashboard-detail-row">
                    <span>
                      Sub-subcategory
                    </span>

                    <strong>
                      {
                        categoryDetails.subSubCategory
                      }
                    </strong>
                  </div>
                )}

                <div className="dashboard-detail-row">
                  <span>
                    Verification
                  </span>

                  <strong>
                    {auction.verificationStatus ??
                      "Not available"}
                  </strong>
                </div>

                <div className="dashboard-detail-row">
                  <span>
                    Verification request
                  </span>

                  <strong>
                    {auction.verificationRequestId ??
                      "Not available"}
                  </strong>
                </div>

                {auctionExtended?.sellerLocation && (
                  <div className="dashboard-detail-row">
                    <span>
                      Seller location
                    </span>

                    <strong>
                      {
                        auctionExtended.sellerLocation
                      }
                    </strong>
                  </div>
                )}
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  BIDDING
                </span>

                <h2>
                  Place your bid
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              {!isLive ? (
                <div className="dashboard-empty">
                  <strong>
                    Bidding is not live
                  </strong>

                  <p>
                    Bidding will become available
                    when the auction reaches its
                    live state.
                  </p>
                </div>
              ) : isEnded ? (
                <div className="dashboard-empty">
                  <strong>
                    Auction ended
                  </strong>

                  <p>
                    This auction is no longer
                    accepting bids.
                  </p>
                </div>
              ) : !biddingUnlocked ? (
                <div className="dashboard-empty">
                  <strong>
                    Unlock bidding
                  </strong>

                  <p>
                    Complete the required auction
                    entry payment before placing
                    a bid.
                  </p>

                  {bidError && (
                    <div
                      className="password-error"
                      role="alert"
                    >
                      {bidError}
                    </div>
                  )}

                  <button
                    type="button"
                    className="dashboard-action"
                    onClick={
                      handleUnlockBidding
                    }
                    disabled={
                      isUnlocking
                    }
                    aria-busy={
                      isUnlocking
                    }
                  >
                    <span>
                      {isUnlocking
                        ? "Processing..."
                        : "Unlock bidding"}
                    </span>

                    <span>
                      →
                    </span>
                  </button>
                </div>
              ) : (
                <div className="dashboard-field">
                  <label htmlFor="bid-amount">
                    Your bid
                  </label>

                  <input
                    id="bid-amount"
                    type="number"
                    min={
                      minimumNextBid
                    }
                    step="1"
                    value={
                      bidAmount
                    }
                    onChange={(
                      event,
                    ) => {
                      setBidAmount(
                        event.target.value,
                      );
                      setBidError(
                        null,
                      );
                    }}
                    placeholder={String(
                      minimumNextBid,
                    )}
                    disabled={
                      isBidding
                    }
                  />

                  <small>
                    Minimum next bid:{" "}
                    {formatPrice(
                      minimumNextBid,
                    )}
                  </small>

                  {bidError && (
                    <div
                      className="password-error"
                      role="alert"
                    >
                      {bidError}
                    </div>
                  )}

                  <div className="dashboard-actions">
                    <button
                      type="button"
                      className="dashboard-action"
                      onClick={
                        handlePlaceBid
                      }
                      disabled={
                        isBidding
                      }
                      aria-busy={
                        isBidding
                      }
                    >
                      <span>
                        {isBidding
                          ? "Placing bid..."
                          : "Place bid"}
                      </span>

                      <span>
                        →
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>
        </section>

        {auctionExtended?.description && (
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  DESCRIPTION
                </span>

                <h2>
                  About this item
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <p>
                {auctionExtended.description}
              </p>
            </div>
          </section>
        )}

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>
                LIVE HISTORY
              </span>

              <h2>
                Recent bids
              </h2>
            </div>

            <button
              type="button"
              className="dashboard-panel-link"
              onClick={() =>
                void loadBids()
              }
              disabled={
                isLoadingBids
              }
            >
              {isLoadingBids
                ? "Loading..."
                : "Refresh"}
            </button>
          </div>

          <div className="dashboard-panel-body">
            {bidError &&
              !biddingUnlocked && (
                <div
                  className="password-error"
                  role="alert"
                >
                  {bidError}
                </div>
              )}

            {isLoadingBids ? (
              <div className="dashboard-loading">
                Loading bid history...
              </div>
            ) : bids.length === 0 ? (
              <div className="dashboard-empty">
                <strong>
                  No bids yet
                </strong>

                <p>
                  Once bids are placed, the
                  auction history will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="dashboard-bid-list">
                {bids.map(
                  (bid) => (
                    <div
                      key={bid.id}
                      className="dashboard-bid-row"
                    >
                      <div>
                        <strong>
                          {
                            bid.bidderDisplayName
                          }
                        </strong>

                        <span>
                          {formatDate(
                            bid.createdAt,
                          )}
                        </span>
                      </div>

                      <strong>
                        {formatPrice(
                          bid.amount,
                        )}
                      </strong>
                    </div>
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