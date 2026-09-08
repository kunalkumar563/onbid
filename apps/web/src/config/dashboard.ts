import type { UserRole } from "../types/auth";

export const ROLE_DASHBOARD_PATH: Record<
  UserRole,
  string
> = {
  bidder: "/dashboard/bidder",
  seller: "/dashboard/seller",
  verifier: "/dashboard/verifier",
  auctioneer: "/dashboard/auctioneer",
  admin: "/dashboard/admin",
};

export function getDashboardPath(
  role: UserRole,
): string {
  return ROLE_DASHBOARD_PATH[role];
}