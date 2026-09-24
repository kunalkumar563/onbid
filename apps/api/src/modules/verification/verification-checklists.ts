import { AuctionCategory } from '@prisma/client';

export interface ChecklistItem {
  id: string;
  label: string;
}

// Illustrative content matching each category's practical concerns —
// confirm exact wording against ops/training docs if it needs to match
// something more precise than what's here (same caveat as the original
// 5-category version this replaces). Expanded to the frontend's full
// 7-category taxonomy per explicit direction to bring the backend in line
// with it — see category-taxonomy.ts and README.
export const VERIFICATION_CHECKLIST_TEMPLATES: Record<AuctionCategory, ChecklistItem[]> = {
  ELECTRONICS: [
    { id: 'powers_on', label: 'Item powers on and functions as described' },
    { id: 'matches_listing', label: 'Item matches the listing photos and description' },
    { id: 'no_undisclosed_damage', label: 'No undisclosed damage, cracks, or missing parts' },
    { id: 'accessories_present', label: 'All accessories mentioned in the listing are present' },
    { id: 'seller_identity_matches', label: "Seller's identity matches their Onbid account" },
  ],
  ART_COLLECTIBLES: [
    {
      id: 'authenticity_plausible',
      label: 'Nothing suggests the item is a reproduction/forgery where authenticity was claimed',
    },
    { id: 'matches_listing', label: 'Item matches the listing photos and description' },
    {
      id: 'no_undisclosed_damage',
      label: 'No undisclosed damage, restoration, or condition issues',
    },
    {
      id: 'provenance_docs_present',
      label: 'Any provenance/certificate documents mentioned in the listing are present',
    },
    { id: 'seller_identity_matches', label: "Seller's identity matches their Onbid account" },
  ],
  FASHION: [
    { id: 'condition_matches', label: 'Condition matches the listing description' },
    { id: 'no_undisclosed_damage', label: 'No undisclosed stains, tears, or damage' },
    { id: 'matches_listing', label: 'Item matches the listing photos' },
    { id: 'seller_identity_matches', label: "Seller's identity matches their Onbid account" },
  ],
  JEWELRY_WATCHES: [
    { id: 'matches_listing', label: 'Item matches the listing photos and description' },
    {
      id: 'hallmark_or_maker_mark_present',
      label: "Hallmark/maker's mark is present if claimed in the listing",
    },
    {
      id: 'functions_correctly',
      label: 'Clasp/movement/mechanism functions correctly (as applicable)',
    },
    {
      id: 'no_undisclosed_damage',
      label: 'No undisclosed damage, missing stones, or wear beyond what was described',
    },
    { id: 'seller_identity_matches', label: "Seller's identity matches their Onbid account" },
  ],
  HOME_GARDEN: [
    { id: 'matches_listing', label: 'Item matches the listing photos and description' },
    { id: 'functions_correctly', label: 'Functions as described, if it is a functional item' },
    { id: 'no_undisclosed_damage', label: 'No undisclosed damage affecting use or safety' },
    { id: 'seller_identity_matches', label: "Seller's identity matches their Onbid account" },
  ],
  SPORTS: [
    { id: 'matches_listing', label: 'Item matches the listing photos and description' },
    { id: 'structural_safety', label: 'No structural damage affecting safe use' },
    {
      id: 'no_undisclosed_damage',
      label: 'No undisclosed damage beyond normal wear described in the listing',
    },
    { id: 'seller_identity_matches', label: "Seller's identity matches their Onbid account" },
  ],
  STATIONERY_OFFICE: [
    { id: 'condition_matches', label: 'Condition matches the listing description' },
    { id: 'complete_set', label: 'All advertised items/pages/parts are present' },
    { id: 'seller_identity_matches', label: "Seller's identity matches their Onbid account" },
  ],
};

export const MIN_VERIFICATION_PHOTOS = 5;
export const MAX_VERIFICATION_PHOTOS = 10;
