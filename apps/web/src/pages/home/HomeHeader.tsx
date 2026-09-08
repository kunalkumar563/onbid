import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
  },
  {
    name: "Art & Collectibles",
    slug: "art_collectibles",
  },
  {
    name: "Fashion",
    slug: "fashion",
  },
  {
    name: "Jewelry & Watches",
    slug: "jewelry_watches",
  },
  {
    name: "Home & Garden",
    slug: "home_garden",
  },
  {
    name: "Sports",
    slug: "sports",
  },
  {
    name: "Stationery & Office",
    slug: "stationery_office",
  },
];

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 8 4c1.5 0 3 .7 4 1.9C13 4.7 14.5 4 16 4a4.8 4.8 0 0 1 4.8 4.8Z" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function HomeHeader() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState<boolean>(false);

  const [searchValue, setSearchValue] =
    useState<string>("");

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      navigate("/auctions");
      return;
    }

    navigate(
      `/auctions?search=${encodeURIComponent(query)}`,
    );

    setMobileOpen(false);
  };

  const closeMobileMenu = (): void => {
    setMobileOpen(false);
  };

  const getCategoryUrl = (
    slug: string,
  ): string => {
    return `/auctions?category=${encodeURIComponent(slug)}`;
  };

  const handleAllCategories = (): void => {
    navigate("/auctions");
    closeMobileMenu();
  };

  const handleLiveAuctions = (): void => {
    navigate("/auctions?status=live");
    closeMobileMenu();
  };

  return (
    <header className="home-header">
      {/* =====================================================
          TOP UTILITY BAR
      ===================================================== */}

      <div className="header-topbar">
        <div className="header-top-left">
          <span>
            <i className="header-dot" />
            Buyer Protection
          </span>

          <span>
            <i className="header-dot" />
            Secure Shipping
          </span>

          <span>
            <i className="header-dot" />
            Safe Payments
          </span>
        </div>

        <div className="header-top-right">
          <span className="trusted-text">
            Trusted by collectors worldwide
          </span>

          <Link
            to="/listings/create"
            className="seller-link"
          >
            Become a Seller
          </Link>
        </div>
      </div>

      {/* =====================================================
          MAIN NAVIGATION
      ===================================================== */}

      <div className="header-main">
        {/* LOGO */}

        <Link
          to="/home"
          className="header-logo"
          aria-label="ONBID Home"
          onClick={closeMobileMenu}
        >
          <span className="logo-name">
            ONBID
          </span>

          <span className="logo-tagline">
            PREMIUM AUCTIONS
          </span>
        </Link>

        {/* SEARCH */}

        <form
          className="header-search"
          onSubmit={handleSearch}
        >
          <span className="search-icon">
            <SearchIcon />
          </span>

          <input
            type="search"
            value={searchValue}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement>,
            ) =>
              setSearchValue(
                event.target.value,
              )
            }
            placeholder="Search auctions, categories, sellers..."
            aria-label="Search auctions, categories and sellers"
          />

          <button
            type="submit"
            className="search-button"
          >
            Search
          </button>
        </form>

        {/* RIGHT SIDE ACTIONS */}

        <div className="header-actions">
          {/* CURRENCY */}

          <button
            type="button"
            className="currency-button"
            aria-label="Currency"
          >
            <span className="india-flag">
              🇮🇳
            </span>

            <span>INR</span>

            <ChevronDown />
          </button>

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="wishlist-button"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <HeartIcon />
          </Link>

          {/* SIGN IN */}

          <Link
            to="/login"
            className="signin-link"
            onClick={closeMobileMenu}
          >
            Sign In
          </Link>

          {/* GET STARTED */}

          <Link
            to="/signup"
            className="header-get-started"
            onClick={closeMobileMenu}
          >
            Get Started
          </Link>

          {/* MOBILE MENU */}

          <button
            type="button"
            className={`mobile-menu-button ${
              mobileOpen ? "active" : ""
            }`}
            onClick={() =>
              setMobileOpen(
                (current) => !current,
              )
            }
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* =====================================================
          CATEGORY NAVIGATION
      ===================================================== */}

      <div className="header-categorybar">
        <div className="category-inner">
          {/* LIVE AUCTIONS */}

          <button
            type="button"
            className="live-auctions"
            onClick={handleLiveAuctions}
            aria-label="View live auctions"
          >
            <span className="live-pulse" />

            <span>LIVE</span>
          </button>

          {/* ALL CATEGORIES */}

          <button
            type="button"
            className="all-categories"
            onClick={handleAllCategories}
            aria-label="View all categories"
          >
            <span>
              All Categories
            </span>

            <ChevronDown />
          </button>

          {/* CATEGORY TABS */}

          <nav
            className="category-navigation"
            aria-label="Auction categories"
          >
            {categories.map(
              (category) => (
                <Link
                  key={category.slug}
                  to={getCategoryUrl(
                    category.slug,
                  )}
                >
                  {category.name}
                </Link>
              ),
            )}
          </nav>
        </div>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      <div
        className={`mobile-navigation ${
          mobileOpen ? "open" : ""
        }`}
      >
        {/* MOBILE SEARCH */}

        <form
          className="mobile-search"
          onSubmit={handleSearch}
        >
          <span>
            <SearchIcon />
          </span>

          <input
            type="search"
            value={searchValue}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement>,
            ) =>
              setSearchValue(
                event.target.value,
              )
            }
            placeholder="Search auctions..."
            aria-label="Search auctions"
          />
        </form>

        {/* LIVE */}

        <button
          type="button"
          className="mobile-navigation-button"
          onClick={handleLiveAuctions}
        >
          <span className="mobile-live-dot" />

          Live Auctions
        </button>

        {/* ALL CATEGORIES */}

        <button
          type="button"
          className="mobile-category-title mobile-navigation-button"
          onClick={handleAllCategories}
        >
          ALL CATEGORIES
        </button>

        {/* CATEGORIES */}

        {categories.map(
          (category) => (
            <Link
              key={category.slug}
              to={getCategoryUrl(
                category.slug,
              )}
              onClick={closeMobileMenu}
            >
              {category.name}
            </Link>
          ),
        )}

        <div className="mobile-divider" />

        {/* WISHLIST */}

        <Link
          to="/wishlist"
          onClick={closeMobileMenu}
        >
          ♡ Wishlist
        </Link>

        {/* SELLER */}

        <Link
          to="/listings/create"
          className="mobile-seller"
          onClick={closeMobileMenu}
        >
          Become a Seller
        </Link>

        {/* SIGN IN */}

        <Link
          to="/login"
          onClick={closeMobileMenu}
        >
          Sign In
        </Link>

        {/* GET STARTED */}

        <Link
          to="/signup"
          className="mobile-start"
          onClick={closeMobileMenu}
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}