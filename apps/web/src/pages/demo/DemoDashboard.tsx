import { Link } from "react-router-dom";

type Workspace = {
  title: string;
  role: string;
  description: string;
  route: string;
  number: string;
};

const workspaces: Workspace[] = [
  {
    title: "Bidder",
    role: "BIDDER WORKSPACE",
    description:
      "Explore auctions, place bids, manage your wishlist and track transactions.",
    route: "/dashboard/bidder",
    number: "01",
  },
  {
    title: "Seller",
    role: "SELLER WORKSPACE",
    description:
      "Manage listings, create auctions and track your selling activity.",
    route: "/dashboard/seller",
    number: "02",
  },
  {
    title: "Verifier",
    role: "VERIFIER WORKSPACE",
    description:
      "Review verification requests, schedule inspections and complete verification.",
    route: "/dashboard/verifier",
    number: "03",
  },
  {
    title: "Auctioneer",
    role: "AUCTIONEER WORKSPACE",
    description:
      "Manage auctions, schedules, live auction control and bidding activity.",
    route: "/dashboard/auctioneer",
    number: "04",
  },
  {
    title: "Admin",
    role: "ADMIN WORKSPACE",
    description:
      "Explore platform administration, disputes, users and operational controls.",
    route: "/dashboard/admin",
    number: "05",
  },
];

export default function DemoDashboard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(124, 58, 237, 0.10), transparent 35%), #fafafa",
        color: "#171717",
        padding: "48px 24px 64px",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "24px",
            marginBottom: "70px",
          }}
        >
          <Link
            to="/"
            style={{
              color: "#171717",
              textDecoration: "none",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "0.16em",
            }}
          >
            ONBID
          </Link>

          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "#737373",
              textTransform: "uppercase",
            }}
          >
            Frontend Preview
          </div>
        </header>

        <section
          style={{
            maxWidth: "780px",
            marginBottom: "54px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: "#7c3aed",
              marginBottom: "16px",
            }}
          >
            ONBID WORKSPACES
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(42px, 7vw, 78px)",
              lineHeight: 0.98,
              letterSpacing: "-0.055em",
              fontWeight: 800,
            }}
          >
            Explore every
            <br />
            workspace.
          </h1>

          <p
            style={{
              marginTop: "24px",
              marginBottom: 0,
              maxWidth: "650px",
              color: "#666",
              fontSize: "17px",
              lineHeight: 1.7,
            }}
          >
            This preview lets you explore the complete OnBid frontend
            experience across every available role without requiring login.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
          }}
        >
          {workspaces.map((workspace) => (
            <Link
              key={workspace.route}
              to={workspace.route}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                background: "rgba(255,255,255,0.88)",
                border: "1px solid #e5e5e5",
                borderRadius: "22px",
                padding: "28px",
                minHeight: "245px",
                boxSizing: "border-box",
                transition:
                  "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform =
                  "translateY(-4px)";
                event.currentTarget.style.boxShadow =
                  "0 18px 45px rgba(0,0,0,0.08)";
                event.currentTarget.style.borderColor =
                  "#d4d4d4";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform =
                  "translateY(0)";
                event.currentTarget.style.boxShadow =
                  "none";
                event.currentTarget.style.borderColor =
                  "#e5e5e5";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "48px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "#a3a3a3",
                  }}
                >
                  {workspace.number}
                </span>

                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#7c3aed",
                  }}
                >
                  VIEW →
                </span>
              </div>

              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: "#737373",
                  marginBottom: "9px",
                }}
              >
                {workspace.role}
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "30px",
                  letterSpacing: "-0.035em",
                }}
              >
                {workspace.title}
              </h2>

              <p
                style={{
                  marginTop: "12px",
                  marginBottom: 0,
                  color: "#737373",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {workspace.description}
              </p>
            </Link>
          ))}
        </section>

        <footer
          style={{
            marginTop: "42px",
            paddingTop: "22px",
            borderTop: "1px solid #e5e5e5",
            color: "#a3a3a3",
            fontSize: "12px",
          }}
        >
          Preview mode · Authentication will be enforced when the
          real backend integration is enabled.
        </footer>
      </div>
    </main>
  );
}