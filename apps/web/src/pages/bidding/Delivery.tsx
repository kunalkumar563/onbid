import {
  Link,
  useParams,
} from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { shippingService } from "../../services/shipping";
import { ApiError } from "../../services/api/client";
import type { DeliveryProof } from "../../services/shipping";

export default function Delivery() {
  const { id } = useParams<{
    id: string;
  }>();

  const [proof, setProof] =
    useState<DeliveryProof | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isConfirming, setIsConfirming] =
    useState(false);

  const [receiptPhotos, setReceiptPhotos] =
    useState<string[]>([]);

  const [confirmationError, setConfirmationError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Transaction ID is missing.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadDeliveryProof() {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await shippingService.getDeliveryProof(id);

        if (isMounted) {
          setProof(response);
        }
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        if (requestError instanceof ApiError) {
          setError(requestError.message);
        } else {
          setError(
            "Unable to load delivery information.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDeliveryProof();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleReceiptPhotosChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files ?? [],
    );

    const photoUrls = files.map((file) =>
      URL.createObjectURL(file),
    );

    setReceiptPhotos(photoUrls);
    setConfirmationError(null);
  };

  const handleConfirmDelivery = async () => {
    if (!id) {
      setConfirmationError(
        "Transaction ID is missing.",
      );
      return;
    }

    if (receiptPhotos.length === 0) {
      setConfirmationError(
        "Please upload at least one delivery receipt photo.",
      );
      return;
    }

    setIsConfirming(true);
    setConfirmationError(null);

    try {
      const response =
        await shippingService.confirmDelivery(
          id,
          {
            photos: receiptPhotos,
          },
        );

      setProof(response);
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setConfirmationError(
          requestError.message,
        );
      } else {
        setConfirmationError(
          "Unable to confirm delivery.",
        );
      }
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <DashboardLayout role="bidder">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              DELIVERY
            </span>

            <h1>
              Track your
              <br />
              <em>delivery.</em>
            </h1>
          </div>

          <p>
            Review shipment information, delivery proof
            and confirm receipt of your winning purchase.
          </p>
        </section>

        {isLoading && (
          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Loading delivery information
                </strong>

                <p>
                  We're retrieving the latest shipping
                  information for this transaction.
                </p>
              </div>
            </div>
          </section>
        )}

        {!isLoading && error && (
          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Delivery information unavailable
                </strong>

                <p>{error}</p>

                <div className="dashboard-actions">
                  <Link
                    to="/transactions"
                    className="dashboard-action"
                  >
                    <span>
                      Back to transactions
                    </span>

                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {!isLoading && !error && (
          <>
            <section className="dashboard-stats">
              <article className="dashboard-stat-card">
                <span>Courier</span>

                <strong>
                  {proof?.courierName ?? "—"}
                </strong>

                <small>
                  Shipping partner
                </small>
              </article>

              <article className="dashboard-stat-card">
                <span>Tracking</span>

                <strong>
                  {proof?.trackingNumber ?? "—"}
                </strong>

                <small>
                  Shipment reference
                </small>
              </article>

              <article className="dashboard-stat-card">
                <span>Dispatch Proof</span>

                <strong>
                  {proof?.predispatchUploadedAt
                    ? "Available"
                    : "Pending"}
                </strong>

                <small>
                  Seller dispatch documentation
                </small>
              </article>

              <article className="dashboard-stat-card">
                <span>Receipt</span>

                <strong>
                  {proof?.receiptUploadedAt
                    ? "Confirmed"
                    : "Pending"}
                </strong>

                <small>
                  Buyer delivery confirmation
                </small>
              </article>
            </section>

            <section className="dashboard-grid">
              <article className="dashboard-panel">
                <div className="dashboard-panel-header">
                  <div>
                    <span>SHIPMENT</span>

                    <h2>
                      Shipping information
                    </h2>
                  </div>
                </div>

                <div className="dashboard-panel-body">
                  <div className="dashboard-empty">
                    <strong>
                      {proof?.trackingNumber
                        ? "Shipment is registered"
                        : "Shipment information pending"}
                    </strong>

                    <p>
                      {proof?.trackingNumber
                        ? `Tracking number: ${proof.trackingNumber}`
                        : "Courier and tracking information will appear after the seller dispatches the item."}
                    </p>

                    {proof?.courierName && (
                      <p>
                        Courier:{" "}
                        {proof.courierName}
                      </p>
                    )}
                  </div>
                </div>
              </article>

              <article className="dashboard-panel">
                <div className="dashboard-panel-header">
                  <div>
                    <span>DISPATCH PROOF</span>

                    <h2>
                      Seller verification
                    </h2>
                  </div>
                </div>

                <div className="dashboard-panel-body">
                  <div className="dashboard-empty">
                    <strong>
                      {proof?.sellerPredispatchPhotos
                        ?.length
                        ? `${proof.sellerPredispatchPhotos.length} dispatch photo(s)`
                        : "No dispatch photos available"}
                    </strong>

                    <p>
                      Seller pre-dispatch photos are
                      stored as part of the delivery proof.
                    </p>
                  </div>
                </div>
              </article>
            </section>

            <section className="dashboard-panel">
              <div className="dashboard-panel-header">
                <div>
                  <span>DELIVERY CONFIRMATION</span>

                  <h2>
                    Confirm receipt
                  </h2>
                </div>
              </div>

              <div className="dashboard-panel-body">
                {proof?.receiptUploadedAt ? (
                  <div className="dashboard-empty">
                    <strong>
                      Delivery confirmed
                    </strong>

                    <p>
                      Your receipt confirmation has already
                      been recorded for this transaction.
                    </p>
                  </div>
                ) : (
                  <div className="dashboard-empty">
                    <strong>
                      Upload delivery receipt
                    </strong>

                    <p>
                      Add photos showing that the item was
                      received before confirming delivery.
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={
                        handleReceiptPhotosChange
                      }
                    />

                    {receiptPhotos.length > 0 && (
                      <p>
                        {receiptPhotos.length} photo(s)
                        selected.
                      </p>
                    )}

                    {confirmationError && (
                      <div
                        className="password-error"
                        role="alert"
                        aria-live="polite"
                      >
                        {confirmationError}
                      </div>
                    )}

                    <div className="dashboard-actions">
                      <button
                        type="button"
                        className="dashboard-action"
                        onClick={
                          handleConfirmDelivery
                        }
                        disabled={isConfirming}
                        aria-busy={isConfirming}
                      >
                        <span>
                          {isConfirming
                            ? "Confirming..."
                            : "Confirm delivery"}
                        </span>

                        <span>→</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="dashboard-panel">
              <div className="dashboard-panel-header">
                <div>
                  <span>NEXT STEP</span>

                  <h2>
                    Transaction overview
                  </h2>
                </div>
              </div>

              <div className="dashboard-panel-body">
                <div className="dashboard-actions">
                  <Link
                    to="/transactions"
                    className="dashboard-action"
                  >
                    <span>
                      Back to transactions
                    </span>

                    <span>→</span>
                  </Link>

                  <Link
                    to="/my-bids"
                    className="dashboard-action"
                  >
                    <span>
                      View my bids
                    </span>

                    <span>→</span>
                  </Link>

                  <Link
                    to="/auctions"
                    className="dashboard-action"
                  >
                    <span>
                      Browse auctions
                    </span>

                    <span>→</span>
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}