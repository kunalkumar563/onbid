import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

type ScheduleStatus = "all" | "upcoming" | "live" | "completed";

type ScheduleRow = {
  id: string;
  lot: string;
  title: string;
  category: string;
  date: string;
  time: string;
  status: Exclude<ScheduleStatus, "all">;
};

const schedule: ScheduleRow[] = [];

const filters: Array<{
  value: ScheduleStatus;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
];

export default function AuctioneerSchedule() {
  const [activeFilter, setActiveFilter] =
    useState<ScheduleStatus>("all");

  const [search, setSearch] = useState("");

  const filteredSchedule = useMemo(() => {
    const query = search.trim().toLowerCase();

    return schedule.filter((item) => {
      const matchesStatus =
        activeFilter === "all" ||
        item.status === activeFilter;

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.lot.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [activeFilter, search]);

  return (
    <DashboardLayout role="auctioneer">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              AUCTION CALENDAR
            </span>

            <h1>
              Plan the
              <br />
              <em>room.</em>
            </h1>
          </div>

          <p>
            Review upcoming auction sessions and keep the
            auctioneer room organized from one schedule.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Today</span>
            <strong>—</strong>
            <small>Scheduled sessions</small>
          </article>

          <article className="dashboard-stat-card">
            <span>Upcoming</span>
            <strong>—</strong>
            <small>Future auction rooms</small>
          </article>

          <article className="dashboard-stat-card">
            <span>Live</span>
            <strong>—</strong>
            <small>Currently running</small>
          </article>

          <article className="dashboard-stat-card">
            <span>Completed</span>
            <strong>—</strong>
            <small>Finished sessions</small>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>SESSION SCHEDULE</span>

              <h2>
                Auction schedule
              </h2>
            </div>

            <Link
              to="/auctioneer/auctions"
              className="dashboard-panel-action"
            >
              View auctions
            </Link>
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
                placeholder="Search scheduled auctions..."
                aria-label="Search scheduled auctions"
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

            {filteredSchedule.length === 0 ? (
              <div
                className="dashboard-empty"
                style={{
                  border: "1px solid #e4dfe7",
                  padding: "56px 24px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                    color: "#7042a8",
                  }}
                >
                  NO SESSIONS
                </span>

                <strong>
                  Nothing is scheduled yet
                </strong>

                <p>
                  Upcoming auction sessions will appear
                  here once scheduling data is connected.
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
                    minWidth: "850px",
                  }}
                >
                  <thead>
                    <tr>
                      <th>Lot</th>
                      <th>Auction</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSchedule.map((item) => (
                      <tr key={item.id}>
                        <td>{item.lot}</td>
                        <td>{item.title}</td>
                        <td>{item.category}</td>
                        <td>{item.date}</td>
                        <td>{item.time}</td>
                        <td>{item.status}</td>
                        <td>
                          <Link
                            to={`/auctions/${item.id}`}
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