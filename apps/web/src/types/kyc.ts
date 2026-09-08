export type KycStatus =
  | "pending"
  | "verified"
  | "rejected";

export type KycProfile = {
  userId: string;

  status: KycStatus;

  rejectionReason?: string | null;

  submittedAt?: string | null;
  verifiedAt?: string | null;
};

export type KycSubmission = {
  panNumber: string;
  aadhaarNumber: string;
};