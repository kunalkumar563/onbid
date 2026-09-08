import { Link } from "react-router-dom";

import HomeHeader from "./HomeHeader";
import "./Home.css";

import artImage from "../../assets/auctions/art/art-01.png";
import electronicsImage from "../../assets/auctions/electronics/electronics-01.png";
import fashionImage from "../../assets/auctions/fashion/fashion-01.png";
import homeImage from "../../assets/auctions/home/home-01.png";
import jewelryImage from "../../assets/auctions/jewelry/jewelry-01.png";
import sportsImage from "../../assets/auctions/sports/sports-01.png";

type Category = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

type Auction = {
  lot: string;
  title: string;
  category: string;
  price: string;
  bids: number;
  image: string;
};

const categories: Category[] = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Rare technology and iconic devices",
    image: electronicsImage,
  },
  {
    name: "Art & Collectibles",
    slug: "art_collectibles",
    description: "Original works and remarkable finds",
    image: artImage,
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Luxury fashion and timeless pieces",
    image: fashionImage,
  },
  {
    name: "Jewelry & Watches",
    slug: "jewelry_watches",
    description: "Exceptional jewels and timepieces",
    image: jewelryImage,
  },
  {
    name: "Home & Garden",
    slug: "home_garden",
    description: "Design objects for distinctive spaces",
    image: homeImage,
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Memorabilia and sporting history",
    image: sportsImage,
  },
  {
    name: "Stationery & Office",
    slug: "stationery_office",
    description: "Premium stationery and office essentials",
    image: sportsImage,
  },
];

const featuredAuctions: Auction[] = [
  {
    lot: "LOT 01",
    title: "The Collector's Camera",
    category: "Electronics",
    price: "₹2,48,000",
    bids: 24,
    image: electronicsImage,
  },
  {
    lot: "LOT 02",
    title: "The Harbor at Dusk",
    category: "Art & Collectibles",
    price: "₹18,40,000",
    bids: 17,
    image: artImage,
  },
  {
    lot: "LOT 03",
    title: "The Collector's Edit",
    category: "Fashion",
    price: "₹4,75,000",
    bids: 31,
    image: fashionImage,
  },
  {
    lot: "LOT 04",
    title: "The Royal Collection",
    category: "Jewelry & Watches",
    price: "₹12,20,000",
    bids: 19,
    image: jewelryImage,
  },
];

const liveAuctions: Auction[] = [
  {
    lot: "LIVE 01",
    title: "Royal Collection",
    category: "Jewelry & Watches",
    price: "₹4,82,000",
    bids: 42,
    image: jewelryImage,
  },
  {
    lot: "LIVE 02",
    title: "The Harbor at Dusk",
    category: "Art & Collectibles",
    price: "₹6,25,000",
    bids: 28,
    image: artImage,
  },
  {
    lot: "LIVE 03",
    title: "The Collector's Desk",
    category: "Stationery & Office",
    price: "₹18,500",
    bids: 16,
    image: sportsImage,
  },
];

const trustItems = [
  {
    number: "01",
    title: "Verified",
    description:
      "Every listing passes our verification standards before reaching the marketplace.",
  },
  {
    number: "02",
    title: "Protected",
    description:
      "Secure payments and buyer protection keep every acquisition confidently yours.",
  },
  {
    number: "03",
    title: "Curated",
    description:
      "Exceptional objects are selected with a focus on quality, rarity and provenance.",
  },
  {
    number: "04",
    title: "Global",
    description:
      "Discover remarkable pieces from sellers and collectors across the world.",
  },
];

function getCategoryUrl(slug: string) {
  return `/auctions?category=${encodeURIComponent(slug)}`;
}

export default function Home() {
  return (
    <div className="home">
      <HomeHeader />

      <main>
        {/* HERO */}
        <section className="home-hero">
          <div className="hero-copy">
            <div className="hero-kicker">THE NEW AUCTION HOUSE</div>

            <h1>
              Bid for
              <br />
              <em>the extraordinary.</em>
            </h1>

            <p>
              Discover remarkable objects, rare collections and stories worth
              owning. ONBID brings the world of premium auctions into one
              refined marketplace.
            </p>

            <div className="hero-buttons">
              <Link to="/auctions" className="hero-primary">
                Explore Auctions
                <span>↗</span>
              </Link>

              <Link to="/auctions" className="hero-secondary">
                Browse All Auctions
              </Link>
            </div>

            <div className="hero-brand-line">
              <span />
              BID CHALU HAI
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="hero-image-wrap">
              <img
                src={jewelryImage}
                alt="Featured ONBID jewelry auction lot"
              />

              <div className="hero-image-shade" />

              <div className="hero-lot-label">
                <span>FEATURED</span>
                <strong>420</strong>
              </div>

              <div className="hero-auction-label">
                <span>FEATURED AUCTION</span>

                <strong>
                  The Royal
                  <br />
                  Collection
                </strong>

                <div>
                  <small>CURRENT BID</small>
                  <b>₹24,80,000</b>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="category-section">
          <div className="section-top">
            <div>
              <span className="section-kicker">
                EXPLORE THE MARKETPLACE
              </span>

              <h2>
                Find your
                <br />
                <em>next obsession.</em>
              </h2>
            </div>

            <p>
              From collectible masterpieces to extraordinary objects,
              discover categories built for curious collectors.
            </p>
          </div>

          <div className="category-tabs">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                to={getCategoryUrl(category.slug)}
                className={
                  index === 0
                    ? "category-tab active"
                    : "category-tab"
                }
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="category-showcase">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.slug}
                to={getCategoryUrl(category.slug)}
                className="category-card"
              >
                <div className="category-card-image">
                  <img
                    src={category.image}
                    alt={category.name}
                  />

                  <div className="category-card-overlay" />

                  <span className="category-number">
                    {category.slug.slice(0, 2).toUpperCase()}
                  </span>
                </div>

                <div className="category-card-content">
                  <span>{category.description}</span>

                  <h3>{category.name}</h3>

                  <strong>Explore →</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED AUCTIONS */}
        <section className="auction-section">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker">
                THE ONBID EDIT
              </span>

              <h2>
                Exceptional
                <br />
                <em>pieces.</em>
              </h2>
            </div>

            <Link to="/auctions">
              View all auctions →
            </Link>
          </div>

          <div className="auction-grid">
            {featuredAuctions.map((auction) => (
              <article
                key={auction.lot}
                className="auction-card"
              >
                <Link
                  to="/auctions"
                  className="auction-card-image"
                >
                  <img
                    src={auction.image}
                    alt={auction.title}
                  />

                  <div className="auction-card-status">
                    <span />
                    AUCTION OPEN
                  </div>

                  <button
                    type="button"
                    className="auction-card-heart"
                    aria-label={`Add ${auction.title} to wishlist`}
                    onClick={(event) =>
                      event.preventDefault()
                    }
                  >
                    ♡
                  </button>
                </Link>

                <div className="auction-card-body">
                  <span className="auction-card-category">
                    {auction.category}
                  </span>

                  <h3>{auction.title}</h3>

                  <div className="auction-card-meta">
                    <div>
                      <small>Current Bid</small>
                      <strong>{auction.price}</strong>
                    </div>

                    <div>
                      <small>Bids</small>
                      <strong>{auction.bids}</strong>
                    </div>
                  </div>

                  <Link
                    to="/auctions"
                    className="auction-card-button"
                  >
                    View Auctions
                    <span>↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* BRAND STATEMENT */}
        <section className="brand-statement">
          <span className="brand-statement-small">
            A DIFFERENT KIND OF AUCTION HOUSE
          </span>

          <div className="brand-statement-main">
            <span>Not just</span>
            <strong>an auction.</strong>
          </div>

          <p>
            We believe the best objects deserve more than a transaction. They
            deserve discovery, context and a new chapter.
          </p>
        </section>

        {/* LIVE AUCTIONS */}
        <section className="live-section">
          <div className="live-heading">
            <div>
              <span className="live-kicker">
                <i />
                LIVE RIGHT NOW
              </span>

              <h2>
                The room
                <br />
                <em>is open.</em>
              </h2>
            </div>

            <Link to="/auctions">
              Enter live auctions →
            </Link>
          </div>

          <div className="live-feature">
            <div className="live-feature-image">
              <img
                src={jewelryImage}
                alt="Live jewelry auction"
              />
            </div>

            <div className="live-feature-content">
              <span>LIVE AUCTION · LOT 720</span>

              <h3>
                Objects with
                <br />
                <em>a pulse.</em>
              </h3>

              <p>
                Join collectors bidding in real time on remarkable pieces from
                today's curated selection.
              </p>

              <div className="live-price">
                <div>
                  <small>CURRENT BID</small>
                  <strong>₹4,82,000</strong>
                </div>

                <div>
                  <small>BIDS</small>
                  <strong>42</strong>
                </div>
              </div>

              <Link
                to="/auctions"
                className="dark-button"
              >
                Explore Auctions
                <span>↗</span>
              </Link>
            </div>
          </div>

          <div className="live-auction-list">
            {liveAuctions.map((auction) => (
              <Link
                key={auction.lot}
                to="/auctions"
                className="live-mini-card"
              >
                <div className="live-mini-image">
                  <img
                    src={auction.image}
                    alt={auction.title}
                  />

                  <span>LIVE</span>
                </div>

                <div className="live-mini-content">
                  <small>{auction.category}</small>

                  <h3>{auction.title}</h3>

                  <strong>{auction.price}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SELLER */}
        <section className="seller-section">
          <div className="seller-copy">
            <span className="section-kicker">
              FOR COLLECTORS & SELLERS
            </span>

            <h2>
              Your piece
              <br />
              deserves
              <br />
              <em>the right room.</em>
            </h2>

            <p>
              Turn exceptional objects into extraordinary opportunities. Bring
              your collection to a marketplace built around trust, presentation
              and serious buyers.
            </p>

            <Link
              to="/listings/create"
              className="seller-button"
            >
              Become a Seller
              <span>↗</span>
            </Link>
          </div>

          <div className="seller-mark">
            <div>◇</div>
            <span>ONBID</span>
          </div>
        </section>

        {/* TRUST */}
        <section className="trust-section">
          <div className="trust-title">
            <span className="section-kicker">
              WHY ONBID
            </span>

            <h2>
              Confidence
              <br />
              in every <em>bid.</em>
            </h2>
          </div>

          <div className="trust-items">
            {trustItems.map((item) => (
              <div key={item.number}>
                <span>{item.number}</span>

                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta">
          <span className="section-kicker">
            YOUR NEXT DISCOVERY AWAITS
          </span>

          <h2>
            What will you
            <br />
            <em>bid on?</em>
          </h2>

          <div className="hero-buttons">
            <Link
              to="/auctions"
              className="hero-primary"
            >
              Explore Auctions
              <span>↗</span>
            </Link>

            <Link
              to="/signup"
              className="hero-secondary"
            >
              Create Account
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-brand">
          <div className="footer-logo">
            ONBID<sup>™</sup>
          </div>

          <p>
            A modern auction marketplace for remarkable objects, serious
            collectors and the stories behind them.
          </p>

          <span>BID CHALU HAI</span>
        </div>

        <div className="footer-column">
          <strong>MARKETPLACE</strong>

          <Link to="/auctions">
            All Auctions
          </Link>

          <Link to="/auctions?status=live">
            Live Auctions
          </Link>

          <Link to="/wishlist">
            Wishlist
          </Link>

          <Link to="/auctions">
            Categories
          </Link>
        </div>

        <div className="footer-column">
          <strong>SELL WITH ONBID</strong>

          <Link to="/listings/create">
            Become a Seller
          </Link>

          <Link to="/listings/create">
            Seller Guide
          </Link>

          <Link to="/listings/create">
            Fees
          </Link>

          <Link to="/verification/queue">
            Verification
          </Link>
        </div>

        <div className="footer-column">
          <strong>COMPANY</strong>

          <Link to="/home">
            About ONBID
          </Link>

          <Link to="/home">
            Contact
          </Link>

          <Link to="/home">
            Privacy
          </Link>

          <Link to="/home">
            Terms
          </Link>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 ONBID. All rights reserved.
          </span>

          <span>
            AUTHENTICITY · TRUST · DISCOVERY
          </span>
        </div>
      </footer>
    </div>
  );
}