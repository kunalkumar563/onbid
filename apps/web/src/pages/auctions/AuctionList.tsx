import {
  Link,
  useSearchParams,
} from "react-router-dom";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Auction } from "../../types/auction";
import type { ListingCategory } from "../../types/listing";
import { api } from "../../services/api/client";
import {
  LISTING_CATEGORIES,
  getCategoryLabel,
  getSubCategories,
  getSubCategoryLabel,
  getSubSubCategories,
  getSubSubCategoryLabel,
} from "../../config/categories";

import "./AuctionList.css";

function formatCurrency(value: number) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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

function getStatusLabel(
  status: Auction["status"],
) {
  switch (status) {
    case "live":
      return "Live";

    case "scheduled":
      return "Scheduled";

    case "pending":
      return "Pending";

    case "ended":
      return "Ended";

    case "cancelled":
      return "Cancelled";

    default:
      return status;
  }
}

function isListingCategory(
  value: string,
): value is ListingCategory {
  return LISTING_CATEGORIES.some(
    (category) =>
      category.value === value,
  );
}

type AuctionWithCategories = Auction & {
  subCategory?: string | null;
  subSubCategory?: string | null;
};

type SortOption =
  | "newest"
  | "ending_soon"
  | "price_low"
  | "price_high"
  | "most_bids";

function getBidCount(
  auction: Auction,
): number {
  const record = auction as Auction & {
    bidCount?: number;
    bidsCount?: number;
  };

  return Number(
    record.bidCount ??
      record.bidsCount ??
      0,
  );
}

function getAuctionTimestamp(
  value: string,
): number {
  const timestamp =
    new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function getSortLabel(
  sort: SortOption,
): string {
  switch (sort) {
    case "ending_soon":
      return "Ending Soon";

    case "price_low":
      return "Price: Low to High";

    case "price_high":
      return "Price: High to Low";

    case "most_bids":
      return "Most Bids";

    case "newest":
    default:
      return "Newest";
  }
}

function AuctionList() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [auctions, setAuctions] =
    useState<Auction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const selectedStatus =
    searchParams.get("status") ??
    "all";

  const selectedCategory =
    searchParams.get("category") ??
    "all";

  const selectedSubCategory =
    searchParams.get("subCategory") ??
    "all";

  const selectedSubSubCategory =
    searchParams.get("subSubCategory") ??
    "all";

  const searchQuery =
    searchParams.get("search") ??
    "";

  const selectedSort =
    (searchParams.get("sort") as SortOption | null) ??
    "newest";

  const availableSubCategories =
    useMemo(() => {
      if (
        selectedCategory === "all" ||
        !isListingCategory(
          selectedCategory,
        )
      ) {
        return [];
      }

      return getSubCategories(
        selectedCategory,
      );
    }, [selectedCategory]);

  const availableSubSubCategories =
    useMemo(() => {
      if (
        selectedCategory === "all" ||
        !isListingCategory(
          selectedCategory,
        ) ||
        selectedSubCategory === "all"
      ) {
        return [];
      }

      return getSubSubCategories(
        selectedCategory,
        selectedSubCategory,
      );
    }, [
      selectedCategory,
      selectedSubCategory,
    ]);

  useEffect(() => {
    let mounted = true;

    async function loadAuctions() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await api.get<Auction[]>(
            "/auctions",
          );

        if (!mounted) {
          return;
        }

        setAuctions(
          Array.isArray(response)
            ? response
            : [],
        );
      } catch (err) {
        if (!mounted) {
          return;
        }

        console.error(
          "Failed to load auctions:",
          err,
        );

        setError(
          "Auctions could not be loaded right now.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadAuctions();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredAuctions =
    useMemo(() => {
      const normalizedSearch =
        searchQuery
          .trim()
          .toLowerCase();

      const result =
        auctions.filter(
          (auction) => {
            const record =
              auction as AuctionWithCategories;

            const categoryValue =
              String(
                auction.category ??
                  "",
              );

            const matchesStatus =
              selectedStatus ===
                "all" ||
              auction.status ===
                selectedStatus;

            const matchesCategory =
              selectedCategory ===
                "all" ||
              categoryValue ===
                selectedCategory;

            const matchesSubCategory =
              selectedSubCategory ===
                "all" ||
              record.subCategory ===
                selectedSubCategory;

            const matchesSubSubCategory =
              selectedSubSubCategory ===
                "all" ||
              record.subSubCategory ===
                selectedSubSubCategory;

            const searchableText =
              [
                auction.title,
                categoryValue,
                record.subCategory ??
                  "",
                record.subSubCategory ??
                  "",
              ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
              normalizedSearch ===
                "" ||
              searchableText.includes(
                normalizedSearch,
              );

            return (
              matchesStatus &&
              matchesCategory &&
              matchesSubCategory &&
              matchesSubSubCategory &&
              matchesSearch
            );
          },
        );

      return [...result].sort(
        (a, b) => {
          switch (selectedSort) {
            case "ending_soon":
              return (
                getAuctionTimestamp(
                  a.endsAt,
                ) -
                getAuctionTimestamp(
                  b.endsAt,
                )
              );

            case "price_low":
              return (
                a.currentBid -
                b.currentBid
              );

            case "price_high":
              return (
                b.currentBid -
                a.currentBid
              );

            case "most_bids":
              return (
                getBidCount(b) -
                getBidCount(a)
              );

            case "newest":
            default:
              return (
                getAuctionTimestamp(
                  b.startsAt,
                ) -
                getAuctionTimestamp(
                  a.startsAt,
                )
              );
          }
        },
      );
    }, [
      auctions,
      selectedStatus,
      selectedCategory,
      selectedSubCategory,
      selectedSubSubCategory,
      searchQuery,
      selectedSort,
    ]);

  function updateFilters(
    updates: Record<
      string,
      string
    >,
  ) {
    const params =
      new URLSearchParams(
        searchParams,
      );

    Object.entries(updates).forEach(
      ([key, value]) => {
        if (
          value === "" ||
          value === "all"
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      },
    );

    setSearchParams(params);
  }

  function changeStatus(
    status: string,
  ) {
    updateFilters({
      status,
    });
  }

  function changeCategory(
    category: string,
  ) {
    updateFilters({
      category,
      subCategory: "all",
      subSubCategory: "all",
    });
  }

  function changeSubCategory(
    subCategory: string,
  ) {
    updateFilters({
      subCategory,
      subSubCategory: "all",
    });
  }

  function changeSubSubCategory(
    subSubCategory: string,
  ) {
    updateFilters({
      subSubCategory,
    });
  }

  function changeSearch(
    search: string,
  ) {
    updateFilters({
      search,
    });
  }

  function changeSort(
    sort: SortOption,
  ) {
    updateFilters({
      sort,
    });
  }

  function clearFilters() {
    setSearchParams({});
  }

  const hasActiveFilters =
    selectedStatus !== "all" ||
    selectedCategory !== "all" ||
    selectedSubCategory !==
      "all" ||
    selectedSubSubCategory !==
      "all" ||
    searchQuery.trim() !== "" ||
    selectedSort !== "newest";

  return (
    <main className="page-shell">
      <section className="page-container">
        <div className="page-header">
          <div>
            <span className="eyebrow">
              ONBID AUCTIONS
            </span>

            <h1>
              Discover Auctions
            </h1>

            <p>
              Explore verified auctions
              and find something worth
              bidding on.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="secondary-button"
          >
            Back to Dashboard
          </Link>
        </div>

        <section className="auction-filters">
          <div className="auction-search">
            <label htmlFor="auction-search">
              Search auctions
            </label>

            <input
              id="auction-search"
              type="search"
              value={searchQuery}
              onChange={(event) =>
                changeSearch(
                  event.target.value,
                )
              }
              placeholder="Search by title or category..."
            />
          </div>

          <div className="auction-filter-grid">
            <div>
              <label htmlFor="auction-status">
                Status
              </label>

              <select
                id="auction-status"
                value={
                  selectedStatus
                }
                onChange={(event) =>
                  changeStatus(
                    event.target.value,
                  )
                }
              >
                <option value="all">
                  All Statuses
                </option>
                <option value="live">
                  Live
                </option>
                <option value="scheduled">
                  Upcoming
                </option>
                <option value="pending">
                  Pending
                </option>
                <option value="ended">
                  Ended
                </option>
                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="auction-category">
                Category
              </label>

              <select
                id="auction-category"
                value={
                  selectedCategory
                }
                onChange={(event) =>
                  changeCategory(
                    event.target.value,
                  )
                }
              >
                <option value="all">
                  All Categories
                </option>

                {LISTING_CATEGORIES.map(
                  (category) => (
                    <option
                      key={
                        category.value
                      }
                      value={
                        category.value
                      }
                    >
                      {category.label}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label htmlFor="auction-subcategory">
                Subcategory
              </label>

              <select
                id="auction-subcategory"
                value={
                  selectedSubCategory
                }
                disabled={
                  selectedCategory ===
                    "all" ||
                  availableSubCategories.length ===
                    0
                }
                onChange={(event) =>
                  changeSubCategory(
                    event.target.value,
                  )
                }
              >
                <option value="all">
                  All Subcategories
                </option>

                {availableSubCategories.map(
                  (subCategory) => (
                    <option
                      key={
                        subCategory.value
                      }
                      value={
                        subCategory.value
                      }
                    >
                      {
                        subCategory.label
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label htmlFor="auction-subsubcategory">
                Sub-subcategory
              </label>

              <select
                id="auction-subsubcategory"
                value={
                  selectedSubSubCategory
                }
                disabled={
                  selectedSubCategory ===
                    "all" ||
                  availableSubSubCategories.length ===
                    0
                }
                onChange={(event) =>
                  changeSubSubCategory(
                    event.target.value,
                  )
                }
              >
                <option value="all">
                  All Sub-subcategories
                </option>

                {availableSubSubCategories.map(
                  (
                    subSubCategory,
                  ) => (
                    <option
                      key={
                        subSubCategory.value
                      }
                      value={
                        subSubCategory.value
                      }
                    >
                      {
                        subSubCategory.label
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label htmlFor="auction-sort">
                Sort By
              </label>

              <select
                id="auction-sort"
                value={
                  selectedSort
                }
                onChange={(event) =>
                  changeSort(
                    event.target.value as SortOption,
                  )
                }
              >
                <option value="newest">
                  Newest
                </option>
                <option value="ending_soon">
                  Ending Soon
                </option>
                <option value="price_low">
                  Price: Low to High
                </option>
                <option value="price_high">
                  Price: High to Low
                </option>
                <option value="most_bids">
                  Most Bids
                </option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="auction-filter-summary">
              <span>
                Showing{" "}
                <strong>
                  {
                    filteredAuctions.length
                  }
                </strong>{" "}
                matching auctions
              </span>

              <button
                type="button"
                className="secondary-button"
                onClick={
                  clearFilters
                }
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        <div className="auction-toolbar">
          {[
            ["all", "All"],
            ["live", "Live"],
            ["scheduled", "Upcoming"],
            ["ended", "Ended"],
          ].map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                className={
                  selectedStatus ===
                  value
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  changeStatus(
                    value,
                  )
                }
              >
                {label}
              </button>
            ),
          )}
        </div>

        <div className="auction-results-heading">
          <div>
            <span className="eyebrow">
              AUCTION RESULTS
            </span>

            <h2>
              {loading
                ? "Loading..."
                : `${filteredAuctions.length} auction${
                    filteredAuctions.length ===
                    1
                      ? ""
                      : "s"
                  }`}
            </h2>
          </div>

          <span>
            Sorted by{" "}
            {getSortLabel(
              selectedSort,
            )}
          </span>
        </div>

        {loading && (
          <section className="auction-state">
            <div className="auction-spinner" />

            <h2>
              Loading auctions
            </h2>

            <p>
              Preparing the latest
              auctions for you.
            </p>
          </section>
        )}

        {!loading && error && (
          <section className="auction-state">
            <div className="auction-state-icon">
              !
            </div>

            <h2>
              Unable to load auctions
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>
          </section>
        )}

        {!loading &&
          !error &&
          filteredAuctions.length ===
            0 && (
            <section className="auction-state">
              <div className="auction-state-icon">
                ◇
              </div>

              <h2>
                No auctions found
              </h2>

              <p>
                There are no auctions
                matching your current
                search and filters.
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    clearFilters
                  }
                >
                  Clear Filters
                </button>
              )}
            </section>
          )}

        {!loading &&
          !error &&
          filteredAuctions.length >
            0 && (
            <section className="auction-grid">
              {filteredAuctions.map(
                (auction) => {
                  const record =
                    auction as AuctionWithCategories;

                  const categoryValue =
                    String(
                      auction.category ??
                        "",
                    );

                  const hasKnownCategory =
                    isListingCategory(
                      categoryValue,
                    );

                  const categoryName =
                    hasKnownCategory
                      ? getCategoryLabel(
                          categoryValue,
                        )
                      : categoryValue ||
                        "Uncategorized";

                  const subCategoryName =
                    hasKnownCategory &&
                    record.subCategory
                      ? getSubCategoryLabel(
                          categoryValue,
                          record.subCategory,
                        )
                      : "";

                  const subSubCategoryName =
                    hasKnownCategory &&
                    record.subCategory &&
                    record.subSubCategory
                      ? getSubSubCategoryLabel(
                          categoryValue,
                          record.subCategory,
                          record.subSubCategory,
                        )
                      : "";

                  const bidCount =
                    getBidCount(
                      auction,
                    );

                  return (
                    <article
                      key={
                        auction.id
                      }
                      className="auction-card"
                    >
                      <div className="auction-card-top">
                        <span
                          className={`auction-status ${auction.status}`}
                        >
                          {getStatusLabel(
                            auction.status,
                          )}
                        </span>

                        <span className="auction-category">
                          {categoryName}
                        </span>
                      </div>

                      <div className="auction-card-body">
                        <h2>
                          {
                            auction.title
                          }
                        </h2>

                        {(subCategoryName ||
                          subSubCategoryName) && (
                          <p>
                            {
                              subCategoryName
                            }

                            {subSubCategoryName &&
                              ` • ${subSubCategoryName}`}
                          </p>
                        )}

                        <div className="auction-price-row">
                          <div>
                            <span>
                              Current Bid
                            </span>

                            <strong>
                              {formatCurrency(
                                auction.currentBid,
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Starting
                            </span>

                            <strong>
                              {formatCurrency(
                                auction.startingPrice,
                              )}
                            </strong>
                          </div>
                        </div>

                        <div className="auction-meta">
                          <div>
                            <span>
                              Starts
                            </span>

                            <strong>
                              {formatDate(
                                auction.startsAt,
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Ends
                            </span>

                            <strong>
                              {formatDate(
                                auction.endsAt,
                              )}
                            </strong>
                          </div>
                        </div>

                        <div className="auction-meta">
                          <div>
                            <span>
                              Minimum Increment
                            </span>

                            <strong>
                              {formatCurrency(
                                auction.minimumIncrement,
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Bids
                            </span>

                            <strong>
                              {bidCount}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="auction-card-footer">
                        <span>
                          {categoryName}
                        </span>

                        <Link
                          to={`/auctions/${auction.id}`}
                          className="auction-view-button"
                        >
                          View Auction
                        </Link>
                      </div>
                    </article>
                  );
                },
              )}
            </section>
          )}
      </section>
    </main>
  );
}

export default AuctionList;