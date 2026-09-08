import { api } from "./api/client";

export type VerificationStatus =
  | "pending"
  | "scheduled"
  | "passed"
  | "failed";

export type VerificationRequest = {
  id: string;
  listingId: string;
  verifierId?: string | null;
  status: VerificationStatus;
  checklist?: Record<string, unknown> | null;
  photos?: string[];
  notes?: string | null;
  scheduledAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
};

export type VerificationQueueResponse = {
  requests: VerificationRequest[];
};

export type ScheduleVerificationRequest = {
  scheduledAt: string;
};

export type CompleteVerificationRequest = {
  verdict: "passed" | "failed";
  checklist: Record<string, unknown>;
  photos: string[];
  notes?: string;
};

export const verificationService = {
  requestVerification(
    listingId: string,
  ): Promise<VerificationRequest> {
    return api.post<VerificationRequest, Record<string, never>>(
      `/listings/${listingId}/request-verification`,
      {},
    );
  },

  getMyQueue(): Promise<VerificationQueueResponse> {
    return api.get<VerificationQueueResponse>(
      "/verifiers/me/queue",
    );
  },

  schedule(
    requestId: string,
    payload: ScheduleVerificationRequest,
  ): Promise<VerificationRequest> {
    return api.put<
      VerificationRequest,
      ScheduleVerificationRequest
    >(
      `/verifiers/requests/${requestId}/schedule`,
      payload,
    );
  },

  complete(
    requestId: string,
    payload: CompleteVerificationRequest,
  ): Promise<VerificationRequest> {
    return api.put<
      VerificationRequest,
      CompleteVerificationRequest
    >(
      `/verifiers/requests/${requestId}/complete`,
      payload,
    );
  },
};