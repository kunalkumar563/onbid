import { api } from "./api/client";

export type TransactionStatus =
  | "awaiting_payment"
  | "paid"
  | "delivered"
  | "released"
  | "refunded"
  | "cancelled";

export type Transaction = {
  id: string;
  auctionId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: TransactionStatus;
  role: "buyer" | "seller";
  paymentDeadline: string;
  paidAt?: string | null;
  deliveredAt?: string | null;
  payoutStatus: "held" | "released" | "withheld";
  auction?: {
    title: string;
    photos: string[];
  };
  createdAt: string;
};

export type PaymentOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  status: "created" | "paid";
};

export const transactionService = {
  getMine(): Promise<Transaction[]> {
    return api.get<Transaction[]>("/transactions/mine");
  },

  getById(transactionId: string): Promise<Transaction> {
    return api.get<Transaction>(`/transactions/${transactionId}`);
  },

  pay(transactionId: string): Promise<PaymentOrderResponse> {
    return api.post<PaymentOrderResponse, Record<string, never>>(
      `/transactions/${transactionId}/pay`,
      {},
    );
  },
};
