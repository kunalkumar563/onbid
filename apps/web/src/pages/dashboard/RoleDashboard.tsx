import type { UserRole } from "../../types/auth";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

type RoleDashboardProps = {
  role: UserRole;
};

const ROLE_CONTENT: Record<
  UserRole,
  {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: string;
  }
> = {
  bidder: {
    eyebrow: "BIDDER WORKSPACE",
    title: "Your auction.",
    description:
      "Discover live auctions, manage your bids and keep track of your winning purchases.",
    primaryAction: "Explore live auctions",
  },

  seller: {
    eyebrow: "SELLER WORKSPACE",
    title: "Your collection.",
    description:
      "Create listings, manage verification and follow every item from submission to sale.",
    primaryAction: "Create a listing",
  },

  verifier: {
    eyebrow: "VERIFIER WORKSPACE",
    title: "Verification desk.",
    description:
      "Review assigned verification requests, complete inspections and submit authenticated results.",
    primaryAction: "Open verification queue",
  },

  auctioneer: {
    eyebrow: "AUCTIONEER WORKSPACE",
    title: "The auction room.",
    description:
      "Manage scheduled auctions, monitor live bidding and oversee auction activity.",
    primaryAction: "View auctions",
  },

  admin: {
    eyebrow: "ADMIN WORKSPACE",
    title: "Platform control.",
    description:
      "Oversee users, auctions, verification, disputes and the operational health of OnBid.",
    primaryAction: "Open platform overview",
  },
};

export default function RoleDashboard({
  role,
}: RoleDashboardProps) {
  const { user } = useAuth();

  const content = ROLE_CONTENT[role];

  return (
    <DashboardLayout role={role}>
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              {content.eyebrow}
            </span>

            <h1>
              {content.title}
            </h1>
          </div>

          <p>
            {content.description}
          </p>
        </section>

        <section className="dashboard-welcome">
          <span className="dashboard-eyebrow">
            WELCOME BACK
          </span>

          <h2>
            {user?.fullName || "Welcome to OnBid"}
          </h2>

          <p>
            Your workspace is ready. Live platform
            information will appear here as it becomes
            available from the OnBid backend.
          </p>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>WORKSPACE</span>
                <h2>Activity</h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  No activity available yet
                </strong>

                <p>
                  Activity from the connected OnBid
                  services will appear here.
                </p>
              </div>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>QUICK ACCESS</span>
                <h2>
                  {content.primaryAction}
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Backend connection required
                </strong>

                <p>
                  This action will become available
                  when its corresponding backend
                  endpoint is connected.
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </DashboardLayout>
  );
}