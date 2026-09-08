import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import type {
  Permission,
  UserRole,
} from "../../types/auth";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
};

/**
 * Frontend preview/demo mode.
 *
 * When VITE_PREVIEW_MODE=true, protected routes are
 * intentionally accessible without authentication so
 * the complete UI can be demonstrated on Vercel.
 *
 * Set VITE_PREVIEW_MODE=false when real authentication
 * should be enforced again.
 */
function isPreviewMode(): boolean {
  return import.meta.env.VITE_PREVIEW_MODE === "true";
}

function getPreviewRole(
  allowedRoles?: UserRole[],
): UserRole {
  return allowedRoles?.[0] ?? "bidder";
}

function ProtectedRoute({
  allowedRoles,
  requiredPermission,
}: ProtectedRouteProps) {
  const {
    status,
    role,
    hasPermission,
  } = useAuth();

  const location = useLocation();

  /*
   * FRONTEND PREVIEW / DEMO FLOW
   *
   * Allows all protected UI routes to be opened directly
   * without requiring a backend authentication session.
   *
   * The actual authentication logic below remains intact
   * and can be restored simply by setting:
   *
   * VITE_PREVIEW_MODE=false
   */
  if (isPreviewMode()) {
    /*
     * Resolve the expected role for the route.
     *
     * This is intentionally not written into AuthContext.
     * It only exists so the route can render its UI.
     *
     * Examples:
     * /dashboard/seller   -> seller preview
     * /dashboard/verifier -> verifier preview
     * /dashboard/admin    -> admin preview
     */
    const previewRole = getPreviewRole(allowedRoles);

    void previewRole;
    void requiredPermission;

    return <Outlet />;
  }

  /*
   * NORMAL AUTHENTICATION FLOW
   *
   * Everything below remains active when preview mode
   * is disabled.
   */

  if (status === "loading") {
    return (
      <main className="route-loading">
        <div className="route-loading-inner">
          <div className="route-loading-brand">
            ONBID
          </div>

          <div className="route-loading-line">
            <span />
          </div>

          <p>
            Preparing your auction experience
          </p>
        </div>
      </main>
    );
  }

  if (
    status === "unauthenticated" ||
    !role
  ) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  if (
    requiredPermission &&
    !hasPermission(requiredPermission)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;