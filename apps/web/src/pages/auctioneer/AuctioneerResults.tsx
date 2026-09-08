import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

type AuctionResultStatus =
  | "completed"
  | "pending"
  | "cancelled"
  | "no_sale";

type AuctionResult = {
  id: string;
  title: string;
  category: string;
  finalBid?: number | null;
  winnerName?: string | null;
  status: AuctionResultStatus;
  endedAt?: string | null;
};

type ResultFilter = "all" | AuctionResultStatus;
type SortOption = "recent" | "oldest" | "highest_bid" | "lowest_bid";

const STATUS_LABELS: Record<AuctionResultStatus, string> = {
  completed: "Completed",
  pending: "Pending",
  cancelled: "Cancelled",
  no_sale: "No Sale",
};

const STATUS_CLASSES: Record<AuctionResultStatus, string> = {
  completed: "bg-green-50 text-green-700 ring-green-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  no_sale: "bg-gray-100 text-gray-600 ring-gray-200",
};

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AuctioneerResults() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ResultFilter>("all");
  const [sort, setSort] = useState<SortOption>("recent");

  /*
   * Backend integration point:
   *
   * Replace this empty state with auctioneerService.getResults()
   * when the backend endpoint is finalized.
   *
   * Do NOT add mock production data here.
   */
  const results: AuctionResult[] = [];

  const filteredResults = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = results.filter((result) => {
      const matchesStatus =
        status === "all" || result.status === status;

      if (!matchesStatus) return false;

      if (!normalizedSearch) return true;

      return (
        result.title.toLowerCase().includes(normalizedSearch) ||
        result.id.toLowerCase().includes(normalizedSearch) ||
        result.category.toLowerCase().includes(normalizedSearch) ||
        (result.winnerName ?? "")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "highest_bid") {
        return (b.finalBid ?? -1) - (a.finalBid ?? -1);
      }

      if (sort === "lowest_bid") {
        return (a.finalBid ?? Number.MAX_SAFE_INTEGER) -
          (b.finalBid ?? Number.MAX_SAFE_INTEGER);
      }

      const aTime = a.endedAt
        ? new Date(a.endedAt).getTime()
        : 0;

      const bTime = b.endedAt
        ? new Date(b.endedAt).getTime()
        : 0;

      return sort === "recent"
        ? bTime - aTime
        : aTime - bTime;
    });
  }, [results, search, status, sort]);

  const hasFilters = Boolean(search.trim()) || status !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setSort("recent");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-600">
              Auctioneer Workspace
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Auction Results
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Review finalized auction outcomes, winning bids, and
              settlement-ready results.
            </p>
          </div>

          <Link
            to="/auctioneer/auctions"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
          >
            Back to Auctions
          </Link>
        </div>

        {/* Operational summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Results</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {results.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {results.filter((item) => item.status === "completed").length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {results.filter((item) => item.status === "pending").length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Final Value</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatCurrency(
                results.reduce(
                  (total, result) =>
                    total + (result.finalBid ?? 0),
                  0,
                ),
              )}
            </p>
          </div>
        </div>

        {/* Filters */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_180px_180px_auto]">
            <div>
              <label
                htmlFor="result-search"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Search
              </label>

              <input
                id="result-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search auction, category or winner..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              />
            </div>

            <div>
              <label
                htmlFor="result-status"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Status
              </label>

              <select
                id="result-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ResultFilter)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              >
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_sale">No Sale</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="result-sort"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Sort
              </label>

              <select
                id="result-sort"
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortOption)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              >
                <option value="recent">Most recent</option>
                <option value="oldest">Oldest</option>
                <option value="highest_bid">Highest final bid</option>
                <option value="lowest_bid">Lowest final bid</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasFilters && sort === "recent"}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Result History
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredResults.length} result
                {filteredResults.length === 1 ? "" : "s"} available.
              </p>
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h4m5-8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-base font-semibold text-gray-900">
                {hasFilters
                  ? "No matching results"
                  : "No auction results yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                {hasFilters
                  ? "Try adjusting your search or filters to find the result you need."
                  : "Completed auction outcomes will appear here once result data is available from the auction service."}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredResults.map((result) => (
                <article
                  key={result.id}
                  className="px-6 py-5 transition hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                          {result.id}
                        </span>

                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_CLASSES[result.status]}`}
                        >
                          {STATUS_LABELS[result.status]}
                        </span>
                      </div>

                      <h3 className="mt-3 truncate text-base font-semibold text-gray-900">
                        {result.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {result.category}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 xl:min-w-[650px]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Winner
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {result.winnerName || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Final Bid
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {formatCurrency(result.finalBid)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Ended
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {formatDate(result.endedAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Details
                        </p>

                        <span className="mt-1 inline-flex text-xs font-medium text-gray-400">
                          Available after API integration
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Integration note */}
        <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/60 p-6">
          <div className="flex gap-4">
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm sm:flex">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Results service integration point
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                The page intentionally contains no fabricated auction
                outcomes. Once the backend result contract is finalized,
                the result service can populate this screen while the
                filtering, sorting, formatting, loading and empty-state
                presentation remain reusable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
