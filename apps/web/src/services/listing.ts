import { api } from "./api/client";

import type {
  Listing,
  ListingCategory,
} from "../types/listing";

export type CreateListingRequest = {
  title: string;
  category: ListingCategory;
  subCategory?: string;
  subSubCategory?: string;
  description: string;
  startingPrice: number;
  auctionDuration: number;
  photos: string[];
  sellerLocation: string;
};

export type UpdateListingRequest = Partial<CreateListingRequest>;
export type ListingListResponse = { listings: Listing[] };

// Helper to interact with local storage for demo purposes
const getLocalListings = (): Listing[] => {
  const saved = localStorage.getItem('onbid_seller_listings');
  return saved ? JSON.parse(saved) : [];
};
const setLocalListings = (listings: Listing[]) => {
  localStorage.setItem('onbid_seller_listings', JSON.stringify(listings));
};

export const listingService = {
  async create(payload: CreateListingRequest): Promise<Listing> {
    // Mocking the backend response
    const newListing: Listing = {
      ...payload,
      id: Date.now().toString(),
      status: "pending_verification",
      sellerId: "mock-seller-id",
      currentPrice: payload.startingPrice,
      bidCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const listings = getLocalListings();
    listings.push(newListing);
    setLocalListings(listings);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    return newListing;
  },

  async getMyListings(): Promise<ListingListResponse> {
    await new Promise(r => setTimeout(r, 300));
    return { listings: getLocalListings() };
  },

  async getById(listingId: string): Promise<Listing> {
    await new Promise(r => setTimeout(r, 300));
    const listings = getLocalListings();
    const found = listings.find(l => l.id === listingId);
    if (!found) throw new Error("Listing not found");
    return found;
  },

  async update(listingId: string, payload: UpdateListingRequest): Promise<Listing> {
    await new Promise(r => setTimeout(r, 300));
    const listings = getLocalListings();
    const idx = listings.findIndex(l => l.id === listingId);
    if (idx === -1) throw new Error("Listing not found");
    
    const updated = { ...listings[idx], ...payload, updatedAt: new Date().toISOString() };
    listings[idx] = updated;
    setLocalListings(listings);
    return updated;
  },

  async requestVerification(listingId: string): Promise<Listing> {
    return this.update(listingId, { status: "PENDING_VERIFICATION" } as any);
  },
};
