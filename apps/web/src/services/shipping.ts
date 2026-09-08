import { api } from "./api/client";

export type PredispatchRequest = {
  photos: string[];
  courierName: string;
  trackingNumber: string;
};

export type DeliveryConfirmationRequest = {
  photos: string[];
};

export type DeliveryProof = {
  id: string;
  transactionId: string;

  sellerPredispatchPhotos: string[];
  buyerReceiptPhotos: string[];

  courierName?: string | null;
  trackingNumber?: string | null;

  predispatchUploadedAt?: string | null;
  receiptUploadedAt?: string | null;
};

export const shippingService = {
  uploadPredispatchPhotos(
    transactionId: string,
    payload: PredispatchRequest,
  ): Promise<DeliveryProof> {
    return api.post<
      DeliveryProof,
      PredispatchRequest
    >(
      `/transactions/${transactionId}/predispatch-photos`,
      payload,
    );
  },

  confirmDelivery(
    transactionId: string,
    payload: DeliveryConfirmationRequest,
  ): Promise<DeliveryProof> {
    return api.post<
      DeliveryProof,
      DeliveryConfirmationRequest
    >(
      `/transactions/${transactionId}/delivery-confirmation`,
      payload,
    );
  },

  getDeliveryProof(
    transactionId: string,
  ): Promise<DeliveryProof> {
    return api.get<DeliveryProof>(
      `/transactions/${transactionId}/proof`,
    );
  },
};