import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import type { Permission } from "../../types/auth";

type PermissionRouteProps = {
  permission?: Permission;
  anyOf?: Permission[];
  allOf?: Permission[];
};

/**
 * Frontend preview/demo mode.
 *
 * When VITE_PREVIEW_MODE=true, permission-protected routes
 * are intentionally accessible without authentication.
 *
 * Set VITE_PREVIEW_MODE=false when real authentication
 * and permission checks should be enforced again.
 */
function isPreviewMode(): boolean {
  return import.meta.env.VITE_PREVIEW_MODE === "true";
}

export default function PermissionRoute({
  permission,
  anyOf,
  allOf,
}: PermissionRouteProps) {
  const {
    status,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuth();

  const location = useLocation();

  /*
   * FRONTEND PREVIEW / DEMO FLOW
   *
   * Allow permission-protected UI to render directly
   * without requiring a logged-in user.
   *
   * The actual permission system remains untouched below
   * and can be restored with VITE_PREVIEW_MODE=false.
   */
  if (isPreviewMode()) {
    void permission;
    void anyOf;
    void allOf;

    return <Outlet />;
  }

  /*
   * NORMAL AUTHENTICATION FLOW
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

  if (status === "unauthenticated") {
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

  const permissionGranted =
    permission
      ? hasPermission(permission)
      : anyOf?.length
        ? hasAnyPermission(anyOf)
        : allOf?.length
          ? hasAllPermissions(allOf)
          : false;

  if (!permissionGranted) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}