export type ListingCategory =
  | "electronics"
  | "art_collectibles"
  | "fashion"
  | "jewelry_watches"
  | "home_garden"
  | "sports"
  | "stationery_office";

export type CategoryOption = {
  value: ListingCategory;
  label: string;
  minimumPrice: number;
};

export type SubCategoryOption = {
  value: string;
  label: string;
};

export type SubSubCategoryOption = {
  value: string;
  label: string;
};

export type ListingCategorySelection = {
  category: ListingCategory;
  subCategory: string;
  subSubCategory: string;
};

export type ListingStatus =
  | "draft"
  | "pending_verification"
  | "verified"
  | "rejected"
  | "active"
  | "ended"
  | "sold"
  | "cancelled";

export type Listing = {
  id: string;
  sellerId: string;

  title: string;

  category: ListingCategory;
  subCategory: string;
  subSubCategory: string;

  description: string;

  startingPrice: number;
  auctionDuration: number;

  photos: string[];

  sellerLocation: string;

  status: ListingStatus;

  verificationRequestId?: string | null;

  verificationStatus?:
    | "pending"
    | "passed"
    | "failed"
    | null;

  createdAt: string;
  updatedAt: string;
};