import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { listingService } from "../../services/listing";
import type {
  Listing,
  ListingCategory,
} from "../../types/listing";
import { ApiError } from "../../services/api/client";
import {
  LISTING_CATEGORIES,
  getCategoryLabel,
  getCategoryMinimumPrice,
  getSubCategories,
  getSubCategoryLabel,
  getSubSubCategories,
} from "../../config/categories";

type FormState = {
  title: string;
  category: ListingCategory | "";
  subCategory: string;
  subSubCategory: string;
  description: string;
  startingPrice: string;
  auctionDuration: string;
  sellerLocation: string;
  photos: string[];
};

const MAX_PHOTOS = 10;
const MAX_TITLE_LENGTH = 160;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_LOCATION_LENGTH = 200;

function listingToForm(listing: Listing): FormState {
  return {
    title: listing.title,
    category: listing.category,
    subCategory: listing.subCategory ?? "",
    subSubCategory: listing.subSubCategory ?? "",
    description: listing.description,
    startingPrice: String(listing.startingPrice),
    auctionDuration: String(listing.auctionDuration),
    sellerLocation: listing.sellerLocation,
    photos: [...listing.photos],
  };
}

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [listing, setListing] =
    useState<Listing | null>(null);

  const [form, setForm] =
    useState<FormState | null>(null);

  const [photoUrl, setPhotoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const subCategories = useMemo(() => {
    if (!form?.category) {
      return [];
    }

    return getSubCategories(form.category);
  }, [form?.category]);

  const subSubCategories = useMemo(() => {
    if (!form?.subCategory) {
      return [];
    }

    return getSubSubCategories(
      form.subCategory,
    );
  }, [form?.subCategory]);

  const minimumPrice = useMemo(() => {
    if (!form?.category) {
      return 0;
    }

    return getCategoryMinimumPrice(form.category);
  }, [form?.category]);

  const selectedCategoryLabel = useMemo(() => {
    if (!form?.category) {
      return "";
    }

    return getCategoryLabel(form.category);
  }, [form?.category]);

  const selectedSubCategoryLabel = useMemo(() => {
    if (!form?.category || !form.subCategory) {
      return "";
    }

    return getSubCategoryLabel(
      form.category,
      form.subCategory,
    );
  }, [form?.category, form?.subCategory]);

  const selectedSubSubCategoryLabel = useMemo(() => {
    if (
      !form?.subCategory ||
      !form.subSubCategory
    ) {
      return "";
    }

    return (
      getSubSubCategories(form.subCategory).find(
        (item) =>
          item.value === form.subSubCategory,
      )?.label ?? form.subSubCategory
    );
  }, [
    form?.subCategory,
    form?.subSubCategory,
  ]);

  useEffect(() => {
    let cancelled = false;

    const loadListing = async () => {
      if (!id) {
        setError("Listing ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response =
          await listingService.getById(id);

        if (cancelled) {
          return;
        }

        if (
          response.status !== "draft" &&
          response.status !== "rejected"
        ) {
          setError(
            "This listing can no longer be edited in its current status.",
          );
          setListing(response);
          setForm(null);
          return;
        }

        setListing(response);
        setForm(listingToForm(response));
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        if (
          requestError instanceof ApiError
        ) {
          setError(requestError.message);
        } else {
          setError(
            "Unable to load this listing.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadListing();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateField = <
    K extends keyof FormState
  >(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });

    setError(null);
  };

  const handleCategoryChange = (
    value: ListingCategory | "",
  ) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        category: value,
        subCategory: "",
        subSubCategory: "",
        startingPrice: "",
      };
    });

    setError(null);
  };

  const handleSubCategoryChange = (
    value: string,
  ) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        subCategory: value,
        subSubCategory: "",
      };
    });

    setError(null);
  };

  const handlePriceChange = (value: string) => {
    if (value === "") {
      updateField("startingPrice", "");
      return;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    updateField("startingPrice", value);
  };

  const addPhoto = () => {
    if (!form) {
      return;
    }

    const value = photoUrl.trim();

    if (!value) {
      setError(
        "Enter a photo URL before adding it.",
      );
      return;
    }

    if (form.photos.length >= MAX_PHOTOS) {
      setError(
        `You can add a maximum of ${MAX_PHOTOS} listing photos.`,
      );
      return;
    }

    try {
      const url = new URL(value);

      if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
      ) {
        throw new Error();
      }
    } catch {
      setError("Please enter a valid photo URL.");
      return;
    }

    if (form.photos.includes(value)) {
      setError(
        "This photo URL has already been added.",
      );
      return;
    }

    updateField("photos", [
      ...form.photos,
      value,
    ]);

    setPhotoUrl("");
  };

  const removePhoto = (photo: string) => {
    if (!form) {
      return;
    }

    updateField(
      "photos",
      form.photos.filter(
        (item) => item !== photo,
      ),
    );
  };

  const validateCategoryHierarchy = () => {
    if (!form?.category) {
      return "Please select a listing category.";
    }

    const validSubCategory = subCategories.some(
      (item) => item.value === form.subCategory,
    );

    if (!form.subCategory || !validSubCategory) {
      return "Please select a valid sub-category.";
    }

    const validSubSubCategory =
      subSubCategories.some(
        (item) =>
          item.value === form.subSubCategory,
      );

    if (
      !form.subSubCategory ||
      !validSubSubCategory
    ) {
      return "Please select a valid sub-sub-category.";
    }

    return null;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!id || !form) {
      setError(
        "Listing information is unavailable.",
      );
      return;
    }

    setError(null);

    const title = form.title.trim();
    const description = form.description.trim();
    const sellerLocation =
      form.sellerLocation.trim();

    const startingPrice =
      Number(form.startingPrice);

    const auctionDuration =
      Number(form.auctionDuration);

    if (!title) {
      setError("Listing title is required.");
      return;
    }

    if (title.length < 3) {
      setError(
        "Listing title must contain at least 3 characters.",
      );
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      setError(
        `Listing title cannot exceed ${MAX_TITLE_LENGTH} characters.`,
      );
      return;
    }

    const categoryError =
      validateCategoryHierarchy();

    if (categoryError) {
      setError(categoryError);
      return;
    }

    if (!description) {
      setError(
        "Listing description is required.",
      );
      return;
    }

    if (description.length < 20) {
      setError(
        "Please provide a more detailed description.",
      );
      return;
    }

    if (
      description.length >
      MAX_DESCRIPTION_LENGTH
    ) {
      setError(
        `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`,
      );
      return;
    }

    if (
      !Number.isFinite(startingPrice) ||
      startingPrice <= 0
    ) {
      setError(
        "Starting price must be greater than zero.",
      );
      return;
    }

    if (startingPrice < minimumPrice) {
      setError(
        `Starting price must be at least ₹${minimumPrice.toLocaleString(
          "en-IN",
        )} for ${selectedCategoryLabel}.`,
      );
      return;
    }

    if (
      !Number.isInteger(auctionDuration) ||
      auctionDuration <= 0
    ) {
      setError(
        "Auction duration must be a positive whole number.",
      );
      return;
    }

    if (auctionDuration > 365) {
      setError(
        "Auction duration cannot exceed 365 days.",
      );
      return;
    }

    if (!sellerLocation) {
      setError(
        "Seller location is required.",
      );
      return;
    }

    if (
      sellerLocation.length >
      MAX_LOCATION_LENGTH
    ) {
      setError(
        `Seller location cannot exceed ${MAX_LOCATION_LENGTH} characters.`,
      );
      return;
    }

    if (form.photos.length === 0) {
      setError(
        "Add at least one listing photo.",
      );
      return;
    }

    if (form.photos.length > MAX_PHOTOS) {
      setError(
        `You can add a maximum of ${MAX_PHOTOS} listing photos.`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedListing =
        await listingService.update(id, {
          title,
          category: form.category as ListingCategory,
          subCategory: form.subCategory,
          subSubCategory: form.subSubCategory,
          description,
          startingPrice,
          auctionDuration,
          photos: form.photos,
          sellerLocation,
        });

      setListing(updatedListing);

      navigate(
        `/listings/${updatedListing.id}`,
        {
          replace: true,
        },
      );
    } catch (requestError) {
      if (
        requestError instanceof ApiError
      ) {
        setError(requestError.message);
      } else {
        setError(
          "Unable to update the listing. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="seller">
        <div className="dashboard-page">
          <div className="dashboard-loading">
            Loading listing...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!form || !listing) {
    return (
      <DashboardLayout role="seller">
        <div className="dashboard-page">
          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Listing cannot be edited
                </strong>

                <p>
                  {error ??
                    "The requested listing could not be loaded."}
                </p>

                <Link
                  to="/my-listings"
                  className="dashboard-action"
                >
                  <span>
                    Back to listings
                  </span>

                  <span>←</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="seller">
      <div className="dashboard-page">
        <section className="dashboard-page-heading">
          <div>
            <span className="dashboard-eyebrow">
              SELLER WORKSPACE
            </span>

            <h1>
              Edit
              <br />
              <em>your listing.</em>
            </h1>
          </div>

          <p>
            Update the listing information
            before continuing through the
            verification workflow.
          </p>
        </section>

        <form onSubmit={handleSubmit}>
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  ITEM INFORMATION
                </span>

                <h2>
                  Listing details
                </h2>
              </div>

              <Link
                to={`/listings/${listing.id}`}
                className="dashboard-panel-link"
              >
                Cancel
              </Link>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-form-grid">
                <div className="dashboard-field dashboard-field-full">
                  <label htmlFor="listing-title">
                    Title
                  </label>

                  <input
                    id="listing-title"
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      updateField(
                        "title",
                        event.target.value,
                      )
                    }
                    maxLength={
                      MAX_TITLE_LENGTH
                    }
                    disabled={isSubmitting}
                    required
                  />

                  <small>
                    {form.title.length}/
                    {MAX_TITLE_LENGTH} characters
                  </small>
                </div>

                <div className="dashboard-field">
                  <label htmlFor="listing-category">
                    Category
                  </label>

                  <select
                    id="listing-category"
                    value={form.category}
                    onChange={(event) =>
                      handleCategoryChange(
                        event.target
                          .value as
                          | ListingCategory
                          | "",
                      )
                    }
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {LISTING_CATEGORIES.map(
                      (category) => (
                        <option
                          key={category.value}
                          value={
                            category.value
                          }
                        >
                          {category.label}
                        </option>
                      ),
                    )}
                  </select>

                  {form.category && (
                    <small>
                      Minimum starting price: ₹
                      {minimumPrice.toLocaleString(
                        "en-IN",
                      )}
                    </small>
                  )}
                </div>

                <div className="dashboard-field">
                  <label htmlFor="listing-sub-category">
                    Sub-category
                  </label>

                  <select
                    id="listing-sub-category"
                    value={
                      form.subCategory
                    }
                    onChange={(event) =>
                      handleSubCategoryChange(
                        event.target.value,
                      )
                    }
                    disabled={
                      isSubmitting ||
                      !form.category
                    }
                    required
                  >
                    <option value="">
                      {form.category
                        ? "Select sub-category"
                        : "Select category first"}
                    </option>

                    {subCategories.map(
                      (subCategory) => (
                        <option
                          key={
                            subCategory.value
                          }
                          value={
                            subCategory.value
                          }
                        >
                          {subCategory.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="dashboard-field">
                  <label htmlFor="listing-sub-sub-category">
                    Sub-sub-category
                  </label>

                  <select
                    id="listing-sub-sub-category"
                    value={
                      form.subSubCategory
                    }
                    onChange={(event) =>
                      updateField(
                        "subSubCategory",
                        event.target.value,
                      )
                    }
                    disabled={
                      isSubmitting ||
                      !form.subCategory
                    }
                    required
                  >
                    <option value="">
                      {form.subCategory
                        ? "Select sub-sub-category"
                        : "Select sub-category first"}
                    </option>

                    {subSubCategories.map(
                      (subSubCategory) => (
                        <option
                          key={
                            subSubCategory.value
                          }
                          value={
                            subSubCategory.value
                          }
                        >
                          {
                            subSubCategory.label
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="dashboard-field">
                  <label htmlFor="listing-location">
                    Seller location
                  </label>

                  <input
                    id="listing-location"
                    type="text"
                    value={
                      form.sellerLocation
                    }
                    onChange={(event) =>
                      updateField(
                        "sellerLocation",
                        event.target.value,
                      )
                    }
                    placeholder="City, state"
                    maxLength={
                      MAX_LOCATION_LENGTH
                    }
                    disabled={isSubmitting}
                    required
                  />

                  <small>
                    {form.sellerLocation.length}/
                    {MAX_LOCATION_LENGTH}
                  </small>
                </div>

                <div className="dashboard-field">
                  <label htmlFor="listing-price">
                    Starting price
                  </label>

                  <input
                    id="listing-price"
                    type="number"
                    value={
                      form.startingPrice
                    }
                    onChange={(event) =>
                      handlePriceChange(
                        event.target.value,
                      )
                    }
                    min={
                      minimumPrice > 0
                        ? minimumPrice
                        : 1
                    }
                    step="0.01"
                    disabled={
                      isSubmitting ||
                      !form.category
                    }
                    required
                  />

                  {minimumPrice > 0 && (
                    <small>
                      Category minimum: ₹
                      {minimumPrice.toLocaleString(
                        "en-IN",
                      )}
                    </small>
                  )}
                </div>

                <div className="dashboard-field">
                  <label htmlFor="listing-duration">
                    Auction duration
                  </label>

                  <input
                    id="listing-duration"
                    type="number"
                    value={
                      form.auctionDuration
                    }
                    onChange={(event) =>
                      updateField(
                        "auctionDuration",
                        event.target.value,
                      )
                    }
                    min="1"
                    max="365"
                    step="1"
                    disabled={isSubmitting}
                    required
                  />

                  <small>
                    Whole number of days, up
                    to 365.
                  </small>
                </div>

                <div className="dashboard-field dashboard-field-full">
                  <label htmlFor="listing-description">
                    Description
                  </label>

                  <textarea
                    id="listing-description"
                    value={
                      form.description
                    }
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value,
                      )
                    }
                    rows={7}
                    maxLength={
                      MAX_DESCRIPTION_LENGTH
                    }
                    disabled={isSubmitting}
                    required
                  />

                  <small>
                    {form.description.length}/
                    {MAX_DESCRIPTION_LENGTH}{" "}
                    characters
                  </small>
                </div>
              </div>

              {form.category && (
                <div
                  style={{
                    marginTop: "24px",
                    padding: "18px 20px",
                    border:
                      "1px solid rgba(91, 61, 255, 0.14)",
                    borderRadius: "14px",
                    background:
                      "rgba(91, 61, 255, 0.035)",
                  }}
                >
                  <small
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      letterSpacing:
                        "0.08em",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    Selected category
                  </small>

                  <strong>
                    {selectedCategoryLabel}
                  </strong>

                  {selectedSubCategoryLabel && (
                    <>
                      {" "}
                      /{" "}
                      {selectedSubCategoryLabel}
                    </>
                  )}

                  {selectedSubSubCategoryLabel && (
                    <>
                      {" "}
                      /{" "}
                      {
                        selectedSubSubCategoryLabel
                      }
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>
                  LISTING MEDIA
                </span>

                <h2>
                  Item photographs
                </h2>
              </div>
            </div>

            <div className="dashboard-panel-body">
              <div className="dashboard-field">
                <label htmlFor="listing-photo">
                  Add photo URL
                </label>

                <div className="dashboard-input-row">
                  <input
                    id="listing-photo"
                    type="url"
                    value={photoUrl}
                    onChange={(event) => {
                      setPhotoUrl(
                        event.target.value,
                      );
                      setError(null);
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        event.preventDefault();
                        addPhoto();
                      }
                    }}
                    placeholder="https://..."
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    className="dashboard-action"
                    onClick={addPhoto}
                    disabled={
                      isSubmitting ||
                      form.photos.length >=
                        MAX_PHOTOS
                    }
                  >
                    <span>
                      Add photo
                    </span>

                    <span>+</span>
                  </button>
                </div>

                <small>
                  {form.photos.length}/
                  {MAX_PHOTOS} photographs added.
                </small>
              </div>

              {form.photos.length > 0 && (
                <div className="dashboard-photo-list">
                  {form.photos.map(
                    (photo, index) => (
                      <div
                        key={photo}
                        className="dashboard-photo-item"
                      >
                        <div>
                          <strong>
                            Photo{" "}
                            {index + 1}
                          </strong>

                          <a
                            href={photo}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {photo}
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removePhoto(
                              photo,
                            )
                          }
                          disabled={
                            isSubmitting
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </section>

          {error && (
            <div
              className="password-error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
              <div className="dashboard-actions">
                <Link
                  to={`/listings/${listing.id}`}
                  className="dashboard-action"
                >
                  <span>
                    Cancel
                  </span>

                  <span>←</span>
                </Link>

                <button
                  type="submit"
                  className="dashboard-action"
                  disabled={isSubmitting}
                  aria-busy={
                    isSubmitting
                  }
                >
                  <span>
                    {isSubmitting
                      ? "Saving changes..."
                      : "Save changes"}
                  </span>

                  <span>→</span>
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </DashboardLayout>
  );
}