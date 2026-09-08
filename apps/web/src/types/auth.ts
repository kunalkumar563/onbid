export type UserRole =
  | "bidder"
  | "seller"
  | "verifier"
  | "auctioneer"
  | "admin";

export type Permission =
  | "dashboard.view"
  | "profile.view"
  | "profile.edit"

  // Auctions
  | "auction.view"
  | "auction.manage"
  | "auction.schedule"
  | "auction.start"
  | "auction.cancel"
  | "auction.activity.view"

  // Bidding
  | "bid.create"
  | "bid.history.view"
  | "auction.entry_payment"
  | "payment.winning"

  // Listings
  | "listing.create"
  | "listing.update_own"
  | "listing.view_own"

  // Verification
  | "verification.request"
  | "verification.queue.view"
  | "verification.schedule"
  | "verification.complete"
  | "verification.photos.upload"
  | "verification.view_all"

  // Shipping / Delivery
  | "shipping.predispatch.upload"
  | "shipping.tracking.update"
  | "delivery.confirm"

  // Transactions
  | "transaction.view_own"

  // Disputes
  | "dispute.create"
  | "dispute.view_own"
  | "dispute.view_all"
  | "dispute.resolve"

  // Administration
  | "verifier.manage"
  | "auctioneer.manage"
  | "users.manage"
  | "roles.manage"
  | "kyc.review"
  | "platform.monitor";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  permissions?: Permission[];
};

export type AuthUser = User;

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterCredentials = {
  fullName: string;
  email: string;
  phone: string;
  // Required by the backend (minimum-age-18 enforcement) — added because
  // nothing in the original form collected it, which blocked registration
  // entirely. ISO date string, e.g. "2005-03-14".
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
};