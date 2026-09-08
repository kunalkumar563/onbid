import { api } from "./api/client";

import type {
  Listing,
  ListingCategory,
} from "../types/listing";

export type CreateListingRequest = {
  title: string;
  category: ListingCategory;
  description: string;
  startingPrice: number;
  auctionDuration: number;
  photos: string[];
  sellerLocation: string;
};

export type UpdateListingRequest =
  Partial<CreateListingRequest>;

export type ListingListResponse = {
  listings: Listing[];
};

export const listingService = {
  create(
    payload: CreateListingRequest,
  ): Promise<Listing> {
    return api.post<
      Listing,
      CreateListingRequest
    >(
      "/listings",
      payload,
    );
  },

  getMyListings(): Promise<ListingListResponse> {
    return api.get<ListingListResponse>(
      "/listings/me",
    );
  },

  getById(
    listingId: string,
  ): Promise<Listing> {
    return api.get<Listing>(
      `/listings/${listingId}`,
    );
  },

  update(
    listingId: string,
    payload: UpdateListingRequest,
  ): Promise<Listing> {
    return api.patch<
      Listing,
      UpdateListingRequest
    >(
      `/listings/${listingId}`,
      payload,
    );
  },

  requestVerification(
    listingId: string,
  ): Promise<Listing> {
    return api.post<
      Listing,
      Record<string, never>
    >(
      `/listings/${listingId}/request-verification`,
      {},
    );
  },
};