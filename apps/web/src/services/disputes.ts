import { api } from "./api/client";

export type DisputeStatus =
  | "open"
  | "under_review"
  | "resolved";

export type DisputeResolution =
  | "full_refund"
  | "partial_refund"
  | "no_refund"
  | "pending";

export type CreateDisputeRequest = {
  transactionId: string;
  reason: string;
};

export type ResolveDisputeRequest = {
  resolution: Exclude<
    DisputeResolution,
    "pending"
  >;
};

export type Dispute = {
  id: string;
  transactionId: string;
  raisedBy: string;
  reason: string;
  status: DisputeStatus;
  resolution: DisputeResolution;
  resolvedBy?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
};

export type AdminDisputeListResponse = {
  disputes: Dispute[];
};

export const disputeService = {
  create(
    payload: CreateDisputeRequest,
  ): Promise<Dispute> {
    return api.post<
      Dispute,
      CreateDisputeRequest
    >("/disputes", payload);
  },

  getAdminQueue(): Promise<AdminDisputeListResponse> {
    return api.get<AdminDisputeListResponse>(
      "/admin/disputes",
    );
  },

  resolve(
    disputeId: string,
    payload: ResolveDisputeRequest,
  ): Promise<Dispute> {
    return api.put<
      Dispute,
      ResolveDisputeRequest
    >(
      `/admin/disputes/${disputeId}/resolve`,
      payload,
    );
  },
};