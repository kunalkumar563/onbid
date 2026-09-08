import type {
  Permission,
  UserRole,
} from "../types/auth";

export const ROLE_PERMISSIONS: Record<
  UserRole,
  Permission[]
> = {
  bidder: [
    "dashboard.view",
    "profile.view",
    "profile.edit",

    "auction.view",
    "auction.entry_payment",

    "bid.create",
    "bid.history.view",

    "payment.winning",
    "transaction.view_own",

    "delivery.confirm",

    "dispute.create",
    "dispute.view_own",
  ],

  seller: [
    "dashboard.view",
    "profile.view",
    "profile.edit",

    "auction.view",

    "listing.create",
    "listing.update_own",
    "listing.view_own",

    "verification.request",

    "shipping.predispatch.upload",
    "shipping.tracking.update",

    "transaction.view_own",

    "dispute.create",
    "dispute.view_own",
  ],

  verifier: [
    "dashboard.view",
    "profile.view",
    "profile.edit",

    "verification.queue.view",
    "verification.schedule",
    "verification.complete",
    "verification.photos.upload",
  ],

  auctioneer: [
    "dashboard.view",
    "profile.view",
    "profile.edit",

    "auction.view",
    "auction.manage",
    "auction.schedule",
    "auction.start",
    "auction.cancel",
    "auction.activity.view",

    "bid.history.view",
  ],

  admin: [
    "dashboard.view",
    "profile.view",
    "profile.edit",

    "auction.view",
    "auction.manage",
    "auction.activity.view",

    "verification.view_all",

    "dispute.view_all",
    "dispute.resolve",

    "verifier.manage",
    "auctioneer.manage",

    "users.manage",
    "roles.manage",

    "kyc.review",
    "platform.monitor",
  ],
};

export function hasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return (
    ROLE_PERMISSIONS[role]?.includes(permission) ??
    false
  );
}

export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) =>
    hasPermission(role, permission),
  );
}

export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) =>
    hasPermission(role, permission),
  );
}