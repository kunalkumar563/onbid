import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function AdminDashboard() {
  const {
    user,
    hasPermission,
  } = useAuth();

  const canManageUsers =
    hasPermission("users.manage");

  const canManageRoles =
    hasPermission("roles.manage");

  const canManageVerifiers =
    hasPermission("verifier.manage");

  const canReviewKyc =
    hasPermission("kyc.review");

  const canManageAuctions =
    hasPermission("auction.manage");

  const canViewDisputes =
    hasPermission("dispute.view_all");

  const canResolveDisputes =
    hasPermission("dispute.resolve");

  const canMonitorPlatform =
    hasPermission("platform.monitor");

  return (
    <DashboardLayout role="admin">
      <div className="dashboard-page">
        {/* =================================================
           PAGE HEADING
           ================================================= */}

        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              ADMIN WORKSPACE
            </span>

            <h1>
              Platform
              <br />
              <em>control.</em>
            </h1>
          </div>

          <p>
            Welcome back
            {user?.fullName
              ? `, ${user.fullName}`
              : ""}
            .
            Manage OnBid operations through the
            permissions assigned to your administrator
            account.
          </p>
        </section>

        {/* =================================================
           DASHBOARD STATS
           ================================================= */}

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Users</span>
            <strong>—</strong>
            <small>
              Platform user data
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Auctions</span>
            <strong>—</strong>
            <small>
              Auction activity
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Verification</span>
            <strong>—</strong>
            <small>
              Verification operations
            </small>
          </article>

          <article className="dashboard-stat-card">
            <span>Disputes</span>
            <strong>—</strong>
            <small>
              Dispute queue
            </small>
          </article>
        </section>

        {/* =================================================
           PLATFORM OPERATIONS + COMPLIANCE
           ================================================= */}

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>PLATFORM OPERATIONS</span>

                <h2>
                  Administration
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-actions">
                {canManageUsers && (
                  <Link
                    to="/admin/users"
                    className="dashboard-action"
                  >
                    <span>
                      Manage users
                    </span>

                    <span>→</span>
                  </Link>
                )}

                {canManageRoles && (
                  <Link
                    to="/admin/roles"
                    className="dashboard-action"
                  >
                    <span>
                      Roles & permissions
                    </span>

                    <span>→</span>
                  </Link>
                )}

                {canManageVerifiers && (
                  <Link
                    to="/admin/verifiers"
                    className="dashboard-action"
                  >
                    <span>
                      Manage verifiers
                    </span>

                    <span>→</span>
                  </Link>
                )}

                {canManageAuctions && (
                  <Link
                    to="/admin/auctions"
                    className="dashboard-action"
                  >
                    <span>
                      Manage auctions
                    </span>

                    <span>→</span>
                  </Link>
                )}

                {!canManageUsers &&
                  !canManageRoles &&
                  !canManageVerifiers &&
                  !canManageAuctions && (
                    <div className="dashboard-empty">
                      <strong>
                        No management permissions
                      </strong>

                      <p>
                        Your account has no management
                        permissions assigned.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>COMPLIANCE</span>

                <h2>
                  Review & oversight
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-actions">
                {canReviewKyc && (
                  <Link
                    to="/admin/kyc"
                    className="dashboard-action"
                  >
                    <span>
                      Review KYC
                    </span>

                    <span>→</span>
                  </Link>
                )}

                {/* ================================
                   DISPUTES — VIEW
                   ================================ */}

                {canViewDisputes && (
                  <Link
                    to="/dashboard/admin/disputes"
                    className="dashboard-action"
                  >
                    <span>
                      Review disputes
                    </span>

                    <span>→</span>
                  </Link>
                )}

                {/* ================================
                   DISPUTES — RESOLVE
                   ================================ */}

                {canResolveDisputes && (
                  <Link
                    to="/dashboard/admin/disputes"
                    className="dashboard-action"
                  >
                    <span>
                      Resolve disputes
                    </span>

                    <span>→</span>
                  </Link>
                )}

                {canMonitorPlatform && (
                  <Link
                    to="/admin/platform"
                    className="dashboard-action"
                  >
                    <span>
                      Monitor platform
                    </span>

                    <span>→</span>
                  </Link>
                )}

                {!canReviewKyc &&
                  !canViewDisputes &&
                  !canResolveDisputes &&
                  !canMonitorPlatform && (
                    <div className="dashboard-empty">
                      <strong>
                        No oversight permissions
                      </strong>

                      <p>
                        Your administrator account has no
                        compliance or monitoring permissions.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </article>
        </section>

        {/* =================================================
           VERIFICATION + DISPUTES
           ================================================= */}

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>VERIFICATION</span>

                <h2>
                  Verification operations
                </h2>
              </div>

              {canManageVerifiers && (
                <Link
                  to="/admin/verifiers"
                  className="dashboard-panel-link"
                >
                  Manage
                </Link>
              )}
            </div>

            <div className="dashboard-panel-body">
              {canManageVerifiers ? (
                <div className="dashboard-empty">
                  <strong>
                    Verification overview
                  </strong>

                  <p>
                    Verifier workload, assignment and
                    verification metrics will appear when
                    the corresponding backend data is
                    connected.
                  </p>
                </div>
              ) : (
                <div className="dashboard-empty">
                  <strong>
                    Access restricted
                  </strong>

                  <p>
                    Your account does not have verifier
                    management permission.
                  </p>
                </div>
              )}
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>DISPUTES</span>

                <h2>
                  Dispute operations
                </h2>
              </div>

              {canViewDisputes && (
                <Link
                  to="/dashboard/admin/disputes"
                  className="dashboard-panel-link"
                >
                  Open queue
                </Link>
              )}
            </div>

            <div className="dashboard-panel-body">
              {canViewDisputes ? (
                <div className="dashboard-empty">
                  <strong>
                    Dispute queue ready
                  </strong>

                  <p>
                    Review seller pre-dispatch evidence,
                    verification records and buyer delivery
                    proof from the dispute resolution queue.
                  </p>

                  <div
                    style={{
                      marginTop: "18px",
                    }}
                  >
                    <Link
                      to="/dashboard/admin/disputes"
                      className="dashboard-action"
                    >
                      <span>
                        Open dispute queue
                      </span>

                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="dashboard-empty">
                  <strong>
                    Access restricted
                  </strong>

                  <p>
                    Your account cannot view the platform
                    dispute queue.
                  </p>
                </div>
              )}
            </div>
          </article>
        </section>

        {/* =================================================
           PLATFORM STATUS
           ================================================= */}

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>PLATFORM STATUS</span>

              <h2>
                Operational overview
              </h2>
            </div>

            {canMonitorPlatform && (
              <Link
                to="/admin/platform"
                className="dashboard-panel-link"
              >
                Open monitoring
              </Link>
            )}
          </div>

          <div className="dashboard-panel-body">
            {canMonitorPlatform ? (
              <div className="dashboard-empty">
                <strong>
                  Platform monitoring is ready
                </strong>

                <p>
                  Real operational metrics will be
                  displayed once the monitoring API is
                  connected.
                </p>
              </div>
            ) : (
              <div className="dashboard-empty">
                <strong>
                  Monitoring access restricted
                </strong>

                <p>
                  Your administrator account does not have
                  platform monitoring permission.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}