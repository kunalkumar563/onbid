import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

type ControlState =
  | "idle"
  | "ready"
  | "running"
  | "paused"
  | "ended";

export default function AuctioneerLiveControl() {
  const [controlState, setControlState] =
    useState<ControlState>("idle");

  const isRunning = controlState === "running";
  const isPaused = controlState === "paused";
  const isEnded = controlState === "ended";

  const statusLabel = {
    idle: "NO LIVE AUCTION",
    ready: "READY",
    running: "LIVE NOW",
    paused: "PAUSED",
    ended: "ENDED",
  }[controlState];

  return (
    <DashboardLayout role="auctioneer">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              LIVE AUCTION CONTROL
            </span>

            <h1>
              Run the
              <br />
              <em>room.</em>
            </h1>
          </div>

          <p>
            Control the active auction room, monitor bidding
            activity and manage the auction session from one
            workspace.
          </p>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <span>Room status</span>
            <strong>
              {isRunning
                ? "LIVE"
                : isPaused
                  ? "PAUSED"
                  : isEnded
                    ? "ENDED"
                    : "—"}
            </strong>
            <small>Current auction state</small>
          </article>

          <article className="dashboard-stat-card">
            <span>Current lot</span>
            <strong>—</strong>
            <small>Active auction lot</small>
          </article>

          <article className="dashboard-stat-card">
            <span>Current bid</span>
            <strong>—</strong>
            <small>Highest accepted bid</small>
          </article>

          <article className="dashboard-stat-card">
            <span>Bids</span>
            <strong>—</strong>
            <small>Activity in this room</small>
          </article>
        </section>

        <section
          className="dashboard-panel"
          style={{
            marginBottom: "24px",
          }}
        >
          <div className="dashboard-panel-header">
            <div>
              <span>AUCTION ROOM</span>

              <h2>
                {controlState === "idle"
                  ? "No live auction"
                  : "Live auction control"}
              </h2>
            </div>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                border: "1px solid #ddd7e2",
                background: "#fff",
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background:
                    isRunning
                      ? "#7042a8"
                      : "#aaa",
                }}
              />

              {statusLabel}
            </span>
          </div>

          <div className="dashboard-panel-body">
            {controlState === "idle" ? (
              <div
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
                    color: "#7042a8",
                    marginBottom: "12px",
                  }}
                >
                  ROOM STANDBY
                </span>

                <strong
                  style={{
                    display: "block",
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  No auction is live right now
                </strong>

                <p
                  style={{
                    margin: "0 auto",
                    maxWidth: "520px",
                    color: "#716b75",
                    lineHeight: 1.7,
                  }}
                >
                  Once an auction is assigned to this
                  auctioneer, its live controls and bidding
                  information will appear here.
                </p>

                <Link
                  to="/auctioneer/schedule"
                  style={{
                    display: "inline-flex",
                    marginTop: "24px",
                    padding: "12px 18px",
                    border: "1px solid #7042a8",
                    background: "#f1eafa",
                    color: "#7042a8",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  View schedule
                </Link>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      border: "1px solid #e4dfe7",
                      padding: "22px",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#716b75",
                        marginBottom: "10px",
                      }}
                    >
                      Current lot
                    </span>

                    <strong
                      style={{
                        fontSize: "24px",
                      }}
                    >
                      —
                    </strong>
                  </div>

                  <div
                    style={{
                      border: "1px solid #e4dfe7",
                      padding: "22px",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#716b75",
                        marginBottom: "10px",
                      }}
                    >
                      Highest bid
                    </span>

                    <strong
                      style={{
                        fontSize: "24px",
                      }}
                    >
                      —
                    </strong>
                  </div>

                  <div
                    style={{
                      border: "1px solid #e4dfe7",
                      padding: "22px",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#716b75",
                        marginBottom: "10px",
                      }}
                    >
                      Active bidders
                    </span>

                    <strong
                      style={{
                        fontSize: "24px",
                      }}
                    >
                      —
                    </strong>
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid #e4dfe7",
                    padding: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#716b75",
                      marginBottom: "12px",
                    }}
                  >
                    Current auction
                  </span>

                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: "22px",
                    }}
                  >
                    Auction room ready
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#716b75",
                      lineHeight: 1.7,
                    }}
                  >
                    Live auction data will be populated by
                    the auction service when backend
                    integration is enabled.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  {controlState === "ready" && (
                    <button
                      type="button"
                      onClick={() =>
                        setControlState("running")
                      }
                      style={{
                        border: "1px solid #7042a8",
                        background: "#7042a8",
                        color: "#fff",
                        padding: "13px 20px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      Start auction
                    </button>
                  )}

                  {isRunning && (
                    <button
                      type="button"
                      onClick={() =>
                        setControlState("paused")
                      }
                      style={{
                        border: "1px solid #7042a8",
                        background: "#f1eafa",
                        color: "#7042a8",
                        padding: "13px 20px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      Pause auction
                    </button>
                  )}

                  {isPaused && (
                    <button
                      type="button"
                      onClick={() =>
                        setControlState("running")
                      }
                      style={{
                        border: "1px solid #7042a8",
                        background: "#7042a8",
                        color: "#fff",
                        padding: "13px 20px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      Resume auction
                    </button>
                  )}

                  {!isEnded && (
                    <button
                      type="button"
                      onClick={() =>
                        setControlState("ended")
                      }
                      style={{
                        border: "1px solid #ddd7e2",
                        background: "#fff",
                        color: "#242027",
                        padding: "13px 20px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      End auction
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>BID ACTIVITY</span>

              <h2>
                Recent bids
              </h2>
            </div>

            <span
              style={{
                fontSize: "12px",
                color: "#716b75",
              }}
            >
              Live feed
            </span>
          </div>

          <div className="dashboard-panel-body">
            <div
              style={{
                border: "1px solid #e4dfe7",
                padding: "42px 24px",
                textAlign: "center",
              }}
            >
              <strong>
                No bid activity yet
              </strong>

              <p
                style={{
                  margin: "10px auto 0",
                  maxWidth: "480px",
                  color: "#716b75",
                  lineHeight: 1.7,
                }}
              >
                Bid events will appear here in real time
                once the auction room is connected to the
                bidding service.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}