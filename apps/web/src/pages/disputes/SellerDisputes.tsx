import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

type DisputeStatus = "open" | "under_review" | "resolved";

type SellerDispute = {
  id: string;
  itemTitle: string;
  transactionId: string;
  buyerName: string;
  reason: string;
  status: DisputeStatus;
  createdAt: string;
  amount: number;
};

const statusConfig: Record<
  DisputeStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  under_review: {
    label: "Under Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const disputes: SellerDispute[] = [];

export default function SellerDisputes() {
  const openCount = disputes.filter(
    (dispute) => dispute.status === "open",
  ).length;

  const reviewCount = disputes.filter(
    (dispute) => dispute.status === "under_review",
  ).length;

  const resolvedCount = disputes.filter(
    (dispute) => dispute.status === "resolved",
  ).length;

  return (
    <DashboardLayout role="seller">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600">
              Seller Center
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Disputes
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review buyer disputes related to your completed transactions
              and keep track of their resolution status.
            </p>
          </div>

          <Link
            to="/dashboard/seller"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-purple-200 hover:text-purple-700"
          >
            <span>←</span>
            Seller Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Open Disputes
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-semibold text-slate-950">
                {openCount}
              </p>

              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                Needs attention
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Under Review
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-semibold text-slate-950">
                {reviewCount}
              </p>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                Admin review
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Resolved
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-semibold text-slate-950">
                {resolvedCount}
              </p>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Information banner */}
        <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-5">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
              ⚖️
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                How dispute resolution works
              </h2>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                When a buyer raises a post-delivery dispute, the transaction
                evidence can be reviewed, including verification records and
                delivery proof. Final resolution is handled by the platform
                administrator.
              </p>
            </div>
          </div>
        </div>

        {/* Disputes */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Dispute Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Disputes associated with your transactions will appear here.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {disputes.length} total
              </span>
            </div>
          </div>

          {disputes.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                ✓
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-900">
                No disputes
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You currently have no dispute requests associated with your
                completed sales.
              </p>

              <Link
                to="/dashboard/seller"
                className="mt-6 inline-flex items-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700"
              >
                Back to Seller Dashboard
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {disputes.map((dispute) => {
                const status = statusConfig[dispute.status];

                return (
                  <article
                    key={dispute.id}
                    className="p-6 transition hover:bg-slate-50/70"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-950">
                            {dispute.itemTitle}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                          <p>
                            <span className="font-medium text-slate-700">
                              Buyer:
                            </span>{" "}
                            {dispute.buyerName}
                          </p>

                          <p>
                            <span className="font-medium text-slate-700">
                              Transaction:
                            </span>{" "}
                            {dispute.transactionId}
                          </p>

                          <p>
                            <span className="font-medium text-slate-700">
                              Amount:
                            </span>{" "}
                            ₹{dispute.amount.toLocaleString("en-IN")}
                          </p>

                          <p>
                            <span className="font-medium text-slate-700">
                              Raised:
                            </span>{" "}
                            {dispute.createdAt}
                          </p>
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Dispute reason
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {dispute.reason}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled
                        className="w-full shrink-0 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-400 lg:w-auto"
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}