import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

type AuctionStatus = "all" | "scheduled" | "live" | "ended";

type AuctionRow = {
  id: string;
  lot: string;
  title: string;
  category: string;
  status: Exclude<AuctionStatus, "all">;
  startTime: string;
  currentBid: string;
  bids: number;
};

const auctions: AuctionRow[] = [];

const filters: Array<{
  value: AuctionStatus;
  label: string;
}> = [
  { value: "all", label: "All auctions" },
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "ended", label: "Ended" },
];

export default function AuctioneerAuctions() {
  const [activeFilter, setActiveFilter] =
    useState<AuctionStatus>("all");

  const [search, setSearch] = useState("");

  const filteredAuctions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return auctions.filter((auction) => {
      const matchesStatus =
        activeFilter === "all" ||
        auction.status === activeFilter;

      const matchesSearch =
        !query ||
        auction.title.toLowerCase().includes(query) ||
        auction.lot.toLowerCase().includes(query) ||
        auction.category.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [activeFilter, search]);

  return (
    <DashboardLayout role="auctioneer">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              AUCTION OPERATIONS
            </span>

            <h1>
              Manage
              <br />
              <em>auctions.</em>
            </h1>
          </div>

          <p>
            Review scheduled, live and completed auctions
            from the auctioneer workspace.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Total auctions</span>
            <strong>—</strong>
            <small>Platform auction data</small>
          </article>

          <article className="dashboard-stat-card">
            <span>Scheduled</span>
            <strong>—</strong>
            <small>Upcoming auction rooms</small>
          </article>

          <article className="dashboard-stat-card">
            <span>Live</span>
            <strong>—</strong>
            <small>Currently active rooms</small>
          </article>

          <article className="dashboard-stat-card">
            <span>Ended</span>
            <strong>—</strong>
            <small>Completed auction rooms</small>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>AUCTION INVENTORY</span>

              <h2>
                All auctions
              </h2>
            </div>
          </div>

          <div className="dashboard-panel-body">
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "24px",
              }}
            >
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setActiveFilter(filter.value)
                  }
                  style={{
                    border:
                      activeFilter === filter.value
                        ? "1px solid #7042a8"
                        : "1px solid #ddd7e2",
                    background:
                      activeFilter === filter.value
                        ? "#f1eafa"
                        : "#fff",
                    color:
                      activeFilter === filter.value
                        ? "#7042a8"
                        : "#242027",
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search auctions..."
                aria-label="Search auctions"
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  padding: "13px 15px",
                  border: "1px solid #ddd7e2",
                  background: "#fff",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>

            {filteredAuctions.length === 0 ? (
              <div
                className="dashboard-empty"
                style={{
                  border: "1px solid #e4dfe7",
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <strong>
                  No auctions available yet
                </strong>

                <p>
                  Auction data will appear here once the
                  auction service is connected.
                </p>
              </div>
            ) : (
              <div
                style={{
                  overflowX: "auto",
                  border: "1px solid #e4dfe7",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "900px",
                  }}
                >
                  <thead>
                    <tr>
                      <th>Lot</th>
                      <th>Auction</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Start</th>
                      <th>Current bid</th>
                      <th>Bids</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAuctions.map((auction) => (
                      <tr key={auction.id}>
                        <td>{auction.lot}</td>
                        <td>{auction.title}</td>
                        <td>{auction.category}</td>
                        <td>{auction.status}</td>
                        <td>{auction.startTime}</td>
                        <td>{auction.currentBid}</td>
                        <td>{auction.bids}</td>
                        <td>
                          <Link
                            to={`/auctions/${auction.id}`}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
