import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { biddingService } from "../../services/bidding";
import { ApiError } from "../../services/api/client";

export default function EntryPayment() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [paymentId, setPaymentId] =
    useState<string | null>(null);

  const handlePayment = async () => {
    if (!id) {
      setError("Auction ID is missing.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response =
        await biddingService.unlockBidding(id);

      setPaymentId(response.paymentId);

      navigate(`/auctions/${id}`, {
        replace: true,
      });
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError(
          "Unable to process the auction entry payment.",
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout role="bidder">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              AUCTION ACCESS
            </span>

            <h1>
              Unlock
              <br />
              <em>bidding.</em>
            </h1>
          </div>

          <p>
            Complete the required auction entry payment
            to unlock bidding for this auction.
          </p>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>ENTRY PAYMENT</span>

              <h2>
                Bidding access
              </h2>
            </div>
          </div>

          <div className="dashboard-panel-body">
            <div className="dashboard-empty">
              <strong>
                Auction entry payment
              </strong>

              <p>
                Continue to the payment process to
                unlock your ability to place bids.
              </p>

              {paymentId && (
                <p>
                  Payment reference: {paymentId}
                </p>
              )}

              {error && (
                <div
                  className="password-error"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <div className="dashboard-actions">
                <Link
                  to={
                    id
                      ? `/auctions/${id}`
                      : "/auctions"
                  }
                  className="dashboard-action"
                >
                  <span>
                    Back to auction
                  </span>

                  <span>
                    ←
                  </span>
                </Link>

                <button
                  type="button"
                  className="dashboard-action"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  aria-busy={isProcessing}
                >
                  <span>
                    {isProcessing
                      ? "Processing..."
                      : "Continue to payment"}
                  </span>

                  <span>
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}