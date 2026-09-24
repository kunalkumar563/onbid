import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import HomeHeader from "../home/HomeHeader";
import ImageMagnifier from "../../components/ImageMagnifier";
import "./AuctionDetail.css";
import {
  getCategoryLabel,
  getSubCategoryLabel,
  getSubSubCategoryLabel,
} from "../../config/categories";
import { biddingService } from "../../services/bidding";
import type {
  Bid,
} from "../../services/bidding";
import type { Auction } from "../../types/auction";
import { api, ApiError } from "../../services/api/client";
const macbookImg = "/auctions/electronics/macbook-m3-pro.png";
const sonyImg = "/auctions/electronics/sony-alpha-a7-iv.png";
const iphoneImg = "/auctions/electronics/iphone-15-pro.png";
const boseImg = "/auctions/electronics/bose-quietcomfort.png";


function formatPrice(
  amount: number,
): string {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(amount);
}

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusClass(
  status: Auction["status"],
): string {
  switch (status) {
    case "live":
      return "success";

    case "scheduled":
    case "pending":
      return "warning";

    case "ended":
    case "cancelled":
      return "danger";

    default:
      return "neutral";
  }
}

function formatStatus(
  status: Auction["status"],
): string {
  return status
    .replace("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function getRemainingTime(
  endsAt: string,
): string {
  const remaining =
    new Date(endsAt).getTime() -
    Date.now();

  if (remaining <= 0) {
    return "Auction ended";
  }

  const totalSeconds =
    Math.floor(
      remaining / 1000,
    );

  const days =
    Math.floor(
      totalSeconds / 86400,
    );

  const hours =
    Math.floor(
      (totalSeconds % 86400) /
        3600,
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60,
    );

  const seconds =
    totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  return `${hours}h ${minutes}m ${seconds}s`;
}

type AuctionCategoryDetails = Auction & {
  subCategory?: string | null;
  subSubCategory?: string | null;
  description?: string | null;
  sellerLocation?: string | null;
  photos?: string[] | null;
};

function getCategoryHierarchy(
  auction: Auction,
) {
  const details =
    auction as AuctionCategoryDetails;

  const category = getCategoryLabel(
    auction.category,
  );

  const subCategory =
    details.subCategory
      ? getSubCategoryLabel(
          auction.category,
          details.subCategory,
        )
      : null;

  const subSubCategory =
    details.subSubCategory
      ? getSubSubCategoryLabel(
          auction.category,
          details.subCategory ?? "",
          details.subSubCategory,
        )
      : null;

  return {
    category,
    subCategory,
    subSubCategory,
  };
}

export default function AuctionDetail() {
  const { id } = useParams<{
    id: string;
  }>();

  const [auction, setAuction] =
    useState<Auction | null>(null);

  const [bids, setBids] =
    useState<Bid[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isLoadingBids, setIsLoadingBids] =
    useState(false);

  const [isUnlocking, setIsUnlocking] =
    useState(false);

  const [isBidding, setIsBidding] =
    useState(false);

  const [bidAmount, setBidAmount] =
    useState("");

  const [biddingUnlocked, setBiddingUnlocked] =
    useState(false);

  const [remainingTime, setRemainingTime] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [bidError, setBidError] =
    useState<string | null>(null);

  const loadAuction =
    useCallback(async () => {
      if (!id) {
        setError(
          "Auction ID is missing.",
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);


      // MOCKED FOR FRONTEND DEV - No API calls
      const demoId = id || "";
      let mockTitle = "Vintage Rolex Chronograph";
      let mockDesc = "A timeless masterpiece of precision and elegance.";
      let mockImg = "/auctions/art/art-01.png"; // fallback
      let mockPrice = 12750;
      
      // ELECTRONICS
      if (demoId === "electronics-demo-0") {
        mockTitle = "MacBook Pro M3";
        mockDesc = "The ultimate pro laptop with M3 chip.";
        mockImg = "/auctions/electronics/macbook-m3-pro.png";
        mockPrice = 135000;
      } else if (demoId === "electronics-demo-1") {
        mockTitle = "Sony Alpha A7 IV";
        mockDesc = "Full-frame mirrorless interchangeable lens camera.";
        mockImg = "/auctions/electronics/sony-alpha-a7-iv.png";
        mockPrice = 110000;
      } else if (demoId === "electronics-demo-2") {
        mockTitle = "iPhone 15 Pro";
        mockDesc = "Titanium design with A17 Pro chip.";
        mockImg = "/auctions/electronics/iphone-15-pro.png";
        mockPrice = 95000;
      } else if (demoId === "electronics-demo-3") {
        mockTitle = "Bose QuietComfort";
        mockDesc = "Legendary noise cancellation and premium comfort.";
        mockImg = "/auctions/electronics/bose-quietcomfort.png";
        mockPrice = 18500;
      }
      // ART & COLLECTIBLES
      else if (demoId === "art_collectibles-demo-0") {
        mockTitle = "Vintage Painting";
        mockDesc = "A rare vintage masterpiece from the 19th century.";
        mockImg = "/auctions/art/vintage-painting.png";
        mockPrice = 520000;
      } else if (demoId === "art_collectibles-demo-1") {
        mockTitle = "Ancient Coin Set";
        mockDesc = "A well-preserved set of historical coins.";
        mockImg = "/auctions/art/ancient-coin-set.png";
        mockPrice = 120000;
      } else if (demoId === "art_collectibles-demo-2") {
        mockTitle = "Rare Stamp Collection";
        mockDesc = "Highly sought-after stamps from around the globe.";
        mockImg = "/auctions/art/rare-stamp-collection.png";
        mockPrice = 60000;
      } else if (demoId === "art_collectibles-demo-3") {
        mockTitle = "Antique Vase";
        mockDesc = "A delicate and beautiful antique porcelain vase.";
        mockImg = "/auctions/art/antique-vase.png";
        mockPrice = 175000;
      }


      // FASHION
      else if (demoId === "fashion-demo-0") {
        mockTitle = "Louis Vuitton Handbag";
        mockDesc = "An exquisite designer handbag crafted with premium materials.";
        mockImg = "/auctions/fashion/louis-vuitton-handbag.png";
        mockPrice = 180000;
      } else if (demoId === "fashion-demo-1") {
        mockTitle = "Gucci Sneakers";
        mockDesc = "Iconic sneakers blending luxury and street style.";
        mockImg = "/auctions/fashion/gucci-sneakers.png";
        mockPrice = 75000;
      } else if (demoId === "fashion-demo-2") {
        mockTitle = "Designer Dress";
        mockDesc = "A stunning piece from the latest haute couture collection.";
        mockImg = "/auctions/fashion/designer-dress.png";
        mockPrice = 75000;
      } else if (demoId === "fashion-demo-3") {
        mockTitle = "Ray-Ban Sunglasses";
        mockDesc = "Classic aviators that never go out of style.";
        mockImg = "/auctions/fashion/ray-ban-sunglasses.png";
        mockPrice = 119000;
      }
      // JEWELRY
      else if (demoId === "jewelry_watches-demo-0") {
        mockTitle = "Diamond Necklace";
        mockDesc = "A breathtaking necklace featuring a cluster of flawless diamonds.";
        mockImg = "/auctions/jewelry/diamond-necklace.png";
        mockPrice = 550000;
      } else if (demoId === "jewelry_watches-demo-1") {
        mockTitle = "Rolex Submariner";
        mockDesc = "The ultimate diver's watch, a masterpiece of horology.";
        mockImg = "/auctions/jewelry/rolex-submariner.png";
        mockPrice = 825000;
      } else if (demoId === "jewelry_watches-demo-2") {
        mockTitle = "Emerald Ring";
        mockDesc = "A gorgeous ring featuring a deep green center emerald.";
        mockImg = "/auctions/jewelry/emerald-ring.png";
        mockPrice = 310000;
      } else if (demoId === "jewelry_watches-demo-3") {
        mockTitle = "Gold Bracelet";
        mockDesc = "A timeless solid gold bracelet with intricate links.";
        mockImg = "/auctions/jewelry/gold-bracelet.png";
        mockPrice = 115000;
      }


      // HOME & GARDEN
      else if (demoId === "home_garden-demo-0") {
        mockTitle = "Designer Sofa";
        mockDesc = "A luxurious, modern designer sofa for your living room.";
        mockImg = "/auctions/home/designer-sofa.png";
        mockPrice = 185000;
      } else if (demoId === "home_garden-demo-1") {
        mockTitle = "Chandelier";
        mockDesc = "An elegant crystal chandelier that lights up any space beautifully.";
        mockImg = "/auctions/home/chandelier.png";
        mockPrice = 65000;
      } else if (demoId === "home_garden-demo-2") {
        mockTitle = "Outdoor Dining Set";
        mockDesc = "A premium weather-resistant outdoor dining set.";
        mockImg = "/auctions/home/outdoor-dining-set.png";
        mockPrice = 110000;
      } else if (demoId === "home_garden-demo-3") {
        mockTitle = "Vintage Decor";
        mockDesc = "A stunning piece of vintage decor to elevate your home aesthetic.";
        mockImg = "/auctions/home/vintage-decor.png";
        mockPrice = 45000;
      }
      // SPORTS
      else if (demoId === "sports-demo-0") {
        mockTitle = "Signed Cricket Bat";
        mockDesc = "A legendary cricket bat signed by one of the all-time greats.";
        mockImg = "/auctions/sports/signed-cricket-bat.png";
        mockPrice = 220000;
      } else if (demoId === "sports-demo-1") {
        mockTitle = "Goalkeeper Gloves";
        mockDesc = "Match-worn goalkeeper gloves with incredible grip and history.";
        mockImg = "/auctions/sports/goalkeeper-gloves.png";
        mockPrice = 18500;
      } else if (demoId === "sports-demo-2") {
        mockTitle = "Wilson Basketball";
        mockDesc = "An authentic Wilson basketball, perfect for collectors.";
        mockImg = "/auctions/sports/wilson-basketball.png";
        mockPrice = 45000;
      } else if (demoId === "sports-demo-3") {
        mockTitle = "Tennis Racket";
        mockDesc = "A professional-grade tennis racket used in championship matches.";
        mockImg = "/auctions/sports/tennis-racket.png";
        mockPrice = 25000;
      }


      // STATIONERY
      else if (demoId === "stationery_office-demo-0") {
        mockTitle = "Montblanc Pen";
        mockDesc = "A luxurious Montblanc Meisterstück fountain pen.";
        mockImg = "/auctions/stationery/montblanc-pen.png";
        mockPrice = 15000;
      } else if (demoId === "stationery_office-demo-1") {
        mockTitle = "Ergonomic Chair";
        mockDesc = "Premium ergonomic office chair for ultimate comfort.";
        mockImg = "/auctions/stationery/ergonomic-chair.png";
        mockPrice = 28000;
      } else if (demoId === "stationery_office-demo-2") {
        mockTitle = "Premium Notebook Set";
        mockDesc = "A set of leather-bound premium notebooks.";
        mockImg = "/auctions/stationery/premium-notebook-set.png";
        mockPrice = 12000;
      } else if (demoId === "stationery_office-demo-3") {
        mockTitle = "Desk Organizer";
        mockDesc = "A beautifully crafted wooden desk organizer.";
        mockImg = "/auctions/stationery/desk-organizer.png";
        mockPrice = 8500;
      }

      const mockAuction = {
        id: demoId || "demo-1045",
        title: mockTitle,
        description: mockDesc,
        image: mockImg,
        status: "live",
        startingPrice: mockPrice - 5000,
        currentBid: mockPrice,
        minimumIncrement: 250,
        startsAt: new Date(Date.now() - 86400000).toISOString(),
        endsAt: new Date(Date.now() + 86400000 * 2.6).toISOString(),
        categoryId: "cat-1",
        category: demoId.includes('art') ? "Art & Collectibles" : "Electronics",
        subCategoryId: "sub-1",
        sellerId: "seller-1",
        verificationStatus: "verified",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Simulate network delay
      setTimeout(() => {
        setAuction(mockAuction as any);
        setError(null);
        setIsLoading(false);
      }, 500);

    }, [id]);

  const loadBids =
    useCallback(async () => {
      if (!id) {
        return;
      }

      setIsLoadingBids(true);
      setBidError(null);


      // MOCKED BIDS
      setTimeout(() => {
        setBids([]);
        setIsLoadingBids(false);
      }, 300);

    }, [id]);

  useEffect(() => {
    void loadAuction();
    void loadBids();
  }, [
    loadAuction,
    loadBids,
  ]);

  useEffect(() => {
    if (!auction) {
      return;
    }

    const updateCountdown = () => {
      setRemainingTime(
        getRemainingTime(
          auction.endsAt,
        ),
      );
    };

    updateCountdown();

    const intervalId =
      window.setInterval(
        updateCountdown,
        1000,
      );

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [auction]);

  const minimumNextBid =
    useMemo(() => {
      if (!auction) {
        return 0;
      }

      return Math.max(
        auction.startingPrice,
        auction.currentBid +
          auction.minimumIncrement,
      );
    }, [auction]);

  const categoryDetails =
    useMemo(() => {
      if (!auction) {
        return null;
      }

      return getCategoryHierarchy(
        auction,
      );
    }, [auction]);

  const auctionExtended =
    auction as AuctionCategoryDetails | null;

  const handleUnlockBidding =
    async () => {
      if (!id) {
        return;
      }

      setIsUnlocking(true);
      setBidError(null);

      try {
        await biddingService.unlockBidding(
          id,
        );

        setBiddingUnlocked(true);
      } catch (requestError) {
        if (
          requestError instanceof ApiError
        ) {
          setBidError(
            requestError.message,
          );
        } else {
          setBidError(
            "Unable to unlock bidding.",
          );
        }
      } finally {
        setIsUnlocking(false);
      }
    };

  const handlePlaceBid =
    async () => {
      if (!id || !auction) {
        return;
      }

      const amount =
        Number(bidAmount);

      if (
        !Number.isFinite(amount) ||
        amount < minimumNextBid
      ) {
        setBidError(
          `Your bid must be at least ${formatPrice(
            minimumNextBid,
          )}.`,
        );
        return;
      }

      setIsBidding(true);
      setBidError(null);


      // MOCKED BID
      setTimeout(() => {
        const createdBid = {
          id: "mock-bid-id",
          auctionId: id,
          bidderId: "me",
          amount: amount,
          status: "accepted",
          createdAt: new Date().toISOString()
        };
        setBids((current) => [createdBid, ...current]);
        setAuction((current) => current ? { ...current, currentBid: createdBid.amount } : current);
        setBidAmount("");
        setIsBidding(false);
      }, 500);

    };

  if (isLoading) {
    return (
      <div className="home auction-detail-page">
        <HomeHeader />
        <div className="auction-detail-premium-loading">
          <div className="loading-spinner"></div>
          <p>Loading premium auction...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <DashboardLayout role="bidder">
        <div className="dashboard-page">
          <section className="dashboard-panel">
            <div className="dashboard-panel-body">
              <div className="dashboard-empty">
                <strong>
                  Auction unavailable
                </strong>

                <p>
                  {error ??
                    "The requested auction could not be loaded."}
                </p>

                <div className="dashboard-actions">
                  <button
                    type="button"
                    className="dashboard-action"
                    onClick={() =>
                      void loadAuction()
                    }
                  >
                    <span>
                      Try again
                    </span>

                    <span>
                      ↻
                    </span>
                  </button>

                  <Link
                    to="/auctions"
                    className="dashboard-action"
                  >
                    <span>
                      Browse auctions
                    </span>

                    <span>
                      ←
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout>
    );
  }

  const isLive =
    auction.status === "live";

  const isEnded =
    auction.status === "ended" ||
    remainingTime ===
      "Auction ended";

  // Calculate time left parts
  const remainingTimeParts = (() => {
    if (!auction) return { days: '00', hours: '00', minutes: '00', seconds: '00' };
    const remaining = new Date(auction.endsAt).getTime() - Date.now();
    if (remaining <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' };
    
    const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const m = Math.floor((remaining / 1000 / 60) % 60);
    const s = Math.floor((remaining / 1000) % 60);
    
    return {
      days: d.toString().padStart(2, '0'),
      hours: h.toString().padStart(2, '0'),
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0')
    };
  })();

  // The mockup quick bids
  const quickBids = [
    minimumNextBid,
    minimumNextBid + auction?.minimumIncrement,
    minimumNextBid + (auction?.minimumIncrement * 2),
    minimumNextBid + (auction?.minimumIncrement * 3),
  ];

  return (
    <div className="home auction-detail-page">
      <HomeHeader />

      <main className="auction-premium-layout">
        <div className="auction-premium-container">
          
          {/* LEFT COLUMN: GALLERY */}
          <div className="auction-gallery">
            <div className="gallery-thumbnails">
              {/* Dummy thumbnails for design */}
              <div className="thumbnail active">
                <img src={(auction as any).image || "/intro/lot-01.webp"} alt="thumb" />
              </div>
              <div className="thumbnail">
                <img src={(auction as any).image} alt="thumb" />
              </div>
              <div className="thumbnail">
                <img src={(auction as any).image} alt="thumb" />
              </div>
              <div className="thumbnail">
                <img src={(auction as any).image} alt="thumb" />
              </div>
            </div>
            <div className="gallery-main">
              <ImageMagnifier src={(auction as any).image || "/intro/lot-01.webp"} alt={auction.title} zoomLevel={2} />
            </div>
          </div>

          {/* RIGHT COLUMN: INFO & BIDDING */}
          <div className="auction-info">
            
            {/* Header */}
            <div className="info-header">
              <span className={`live-badge ${getStatusClass(auction.status)}`}>
                <span className="live-dot" /> {formatStatus(auction.status)}
              </span>
              
              <h1>{auction.title}</h1>
              <p>{(auction as any).description}</p>
              
              <div className="meta-tags">
                <span className="tag">🏷️ {categoryDetails?.category || 'Luxury'}</span>
                <span className="tag">📦 Lot #{auction.id.slice(0,4)}</span>
                <span className="tag verified">✓ Authenticated</span>
              </div>
            </div>

            {/* Bidding Box */}
            <div className="bidding-box">
              <div className="bidding-box-top">
                <div className="current-bid-col">
                  <span className="label">Current Bid</span>
                  <div className="price">{formatPrice(auction.currentBid)}</div>
                </div>
                
                <div className="time-left-col">
                  <span className="label">Time Left</span>
                  <div className="timer-display">
                    <div className="time-block">
                      <span className="num">{remainingTimeParts.days}</span>
                      <span className="unit">Days</span>
                    </div>
                    <div className="time-block">
                      <span className="num">{remainingTimeParts.hours}</span>
                      <span className="unit">Hours</span>
                    </div>
                    <div className="time-block">
                      <span className="num">{remainingTimeParts.minutes}</span>
                      <span className="unit">Minutes</span>
                    </div>
                    <div className="time-block">
                      <span className="num">{remainingTimeParts.seconds}</span>
                      <span className="unit">Seconds</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="bidding-action-area">
                {!isLive ? (
                  <div className="not-live-msg">Bidding will open when the auction is live.</div>
                ) : isEnded ? (
                  <div className="not-live-msg">This auction has ended.</div>
                ) : !biddingUnlocked ? (
                   <button className="btn-place-bid" onClick={handleUnlockBidding} disabled={isUnlocking}>
                     {isUnlocking ? "Processing..." : "Unlock Bidding"}
                   </button>
                ) : (
                  <>
                    <button 
                      className="btn-place-bid" 
                      onClick={handlePlaceBid} 
                      disabled={isBidding || !bidAmount}
                    >
                      🔨 {isBidding ? "Placing Bid..." : "Place Bid"}
                    </button>

                    <div className="bid-input-row">
                      <span className="currency-symbol">₹</span>
                      <input 
                        type="number" 
                        value={bidAmount} 
                        onChange={(e) => {
                          setBidAmount(e.target.value);
                          setBidError(null);
                        }}
                        placeholder={`Enter your bid amount`}
                      />
                    </div>

                    <div className="quick-bids">
                      <span className="quick-label">Quick Bid</span>
                      <div className="quick-bid-buttons">
                        {quickBids.map((amount) => (
                          <button 
                            key={amount} 
                            onClick={() => setBidAmount(amount.toString())}
                          >
                            {formatPrice(amount)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {bidError && <div className="bid-error">{bidError}</div>}
                    {error && <div className="bid-error">{error}</div>}
                  </>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="info-footer">
              <button className="footer-btn">♡ Add to Watchlist</button>
              <button className="footer-btn">🔗 Share</button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

