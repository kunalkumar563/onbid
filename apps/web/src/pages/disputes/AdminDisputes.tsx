import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

type DisputeStatus = "open" | "under_review" | "resolved";

type Resolution =
  | "pending"
  | "full_refund"
  | "partial_refund"
  | "no_refund";

type Dispute = {
  id: string;
  transactionId: string;
  itemTitle: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  reason: string;
  status: DisputeStatus;
  resolution: Resolution;
  createdAt: string;
  verificationPassed: boolean;
  sellerPhotos: string[];
  buyerPhotos: string[];
};

const disputes: Dispute[] = [];

const statusConfig: Record<
  DisputeStatus,
  {
    label: string;
    className: string;
  }
> = {
  open: {
    label: "Open",
    className:
      "border-rose-200 bg-rose-50 text-rose-700",
  },
  under_review: {
    label: "Under Review",
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
  },
  resolved: {
    label: "Resolved",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

const resolutionConfig: Record<
  Resolution,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    className: "text-slate-500",
  },
  full_refund: {
    label: "Full Refund",
    className: "text-blue-700",
  },
  partial_refund: {
    label: "Partial Refund",
    className: "text-purple-700",
  },
  no_refund: {
    label: "No Refund",
    className: "text-slate-700",
  },
};

export default function AdminDisputes() {
  const [statusFilter, setStatusFilter] =
    useState<"all" | DisputeStatus>("all");

  const filteredDisputes = useMemo(() => {
    if (statusFilter === "all") {
      return disputes;
    }

    return disputes.filter(
      (dispute) => dispute.status === statusFilter,
    );
  }, [statusFilter]);

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
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600">
              Platform Operations
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Dispute Resolution
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Review transaction evidence and resolve post-delivery
              disputes using the verification record and delivery
              proof.
            </p>
          </div>

          <Link
            to="/dashboard/admin"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-purple-200 hover:text-purple-700"
          >
            <span>←</span>
            Admin Dashboard
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Open Disputes
            </p>

            <div className="mt-3 flex items-end justify-between">
              <span className="text-3xl font-semibold text-slate-950">
                {openCount}
              </span>

              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                Action required
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Under Review
            </p>

            <div className="mt-3 flex items-end justify-between">
              <span className="text-3xl font-semibold text-slate-950">
                {reviewCount}
              </span>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                In progress
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Resolved
            </p>

            <div className="mt-3 flex items-end justify-between">
              <span className="text-3xl font-semibold text-slate-950">
                {resolvedCount}
              </span>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Evidence information */}
        <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-5">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
              ⚖️
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Resolution evidence
              </h2>

              <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">
                Compare the seller&apos;s pre-dispatch photos,
                original verification record, and buyer&apos;s
                delivery photos before deciding the outcome.
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Dispute Queue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review and manage platform disputes.
              </p>
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "all"
                    | DisputeStatus,
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            >
              <option value="all">All disputes</option>
              <option value="open">Open</option>
              <option value="under_review">
                Under Review
              </option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Queue */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {filteredDisputes.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                ✓
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-900">
                No disputes found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are currently no disputes matching the
                selected filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredDisputes.map((dispute) => {
                const status =
                  statusConfig[dispute.status];

                const resolution =
                  resolutionConfig[
                    dispute.resolution
                  ];

                return (
                  <article
                    key={dispute.id}
                    className="p-6 transition hover:bg-slate-50/70"
                  >
                    <div className="flex flex-col gap-6">
                      {/* Main information */}
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-950">
                              {dispute.itemTitle}
                            </h3>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          <div className="mt-3 grid gap-2 text-sm text-slate-500 md:grid-cols-2">
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
                              ₹
                              {dispute.amount.toLocaleString(
                                "en-IN",
                              )}
                            </p>

                            <p>
                              <span className="font-medium text-slate-700">
                                Buyer:
                              </span>{" "}
                              {dispute.buyerName}
                            </p>

                            <p>
                              <span className="font-medium text-slate-700">
                                Seller:
                              </span>{" "}
                              {dispute.sellerName}
                            </p>

                            <p>
                              <span className="font-medium text-slate-700">
                                Raised:
                              </span>{" "}
                              {dispute.createdAt}
                            </p>

                            <p>
                              <span className="font-medium text-slate-700">
                                Resolution:
                              </span>{" "}
                              <span
                                className={
                                  resolution.className
                                }
                              >
                                {resolution.label}
                              </span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled
                          className="w-full shrink-0 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white opacity-50 lg:w-auto"
                        >
                          Review Dispute
                        </button>
                      </div>

                      {/* Reason */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Buyer&apos;s dispute reason
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {dispute.reason}
                        </p>
                      </div>

                      {/* Evidence */}
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Seller evidence
                          </p>

                          <p className="mt-2 text-sm font-medium text-slate-900">
                            {dispute.sellerPhotos.length}{" "}
                            pre-dispatch photo
                            {dispute.sellerPhotos.length !==
                            1
                              ? "s"
                              : ""}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Condition before shipment
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Buyer evidence
                          </p>

                          <p className="mt-2 text-sm font-medium text-slate-900">
                            {dispute.buyerPhotos.length}{" "}
                            delivery photo
                            {dispute.buyerPhotos.length !==
                            1
                              ? "s"
                              : ""}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Condition on receipt
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Verification
                          </p>

                          <p className="mt-2 text-sm font-medium text-slate-900">
                            {dispute.verificationPassed
                              ? "Passed"
                              : "Not passed"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Original item inspection
                          </p>
                        </div>
                      </div>

                      {/* Resolution actions */}
                      {dispute.status !== "resolved" && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                Resolution
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Final resolution is applied after
                                reviewing the available evidence.
                              </p>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-3">
                              <button
                                type="button"
                                disabled
                                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-700 opacity-50"
                              >
                                Full Refund
                              </button>

                              <button
                                type="button"
                                disabled
                                className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-xs font-semibold text-purple-700 opacity-50"
                              >
                                Partial Refund
                              </button>

                              <button
                                type="button"
                                disabled
                                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 opacity-50"
                              >
                                No Refund
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
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