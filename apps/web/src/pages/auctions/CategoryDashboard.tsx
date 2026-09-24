import AllCategories from './AllCategories';
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import HomeHeader from '../home/HomeHeader';
import './CategoryDashboard.css';

// Import all images
const artImg = "/auctions/art/art-01.png";
const artBanner = "/auctions/art/art-banner.png";
const electronicsImg = "/auctions/electronics/electronics-01.png";
const electronicsBanner = "/auctions/electronics/electronics-banner.png";
const fashionImg = "/auctions/fashion/fashion-01.png";
const fashionBanner = "/auctions/fashion/fashion-banner.png";
const homeImg = "/auctions/home/home-01.png";
const homeBanner = "/auctions/home/home-banner.png";
const jewelryImg = "/auctions/jewelry/jewelry-01.png";
const jewelryBanner = "/auctions/jewelry/jewelry-banner.png";
const sportsImg = "/auctions/sports/sports-01.png";
const sportsBanner = "/auctions/sports/sports-banner.png";
const stationeryBanner = "/auctions/stationery/stationery-banner.png";
// missing images will use fallback or same ones
const vehiclesImg = "/auctions/vehicles/vehicles-01.png";
const antiquesImg = "/auctions/antiques/antiques-01.png";

// Electronics featured products
const macbookImg = "/auctions/electronics/macbook-m3-pro.png";
const sonyImg = "/auctions/electronics/sony-alpha-a7-iv.png";
const iphoneImg = "/auctions/electronics/iphone-15-pro.png";
const boseImg = "/auctions/electronics/bose-quietcomfort.png";

const categoryData = {
  electronics: {
    name: 'Electronics',
    tagline: 'Innovative tech. Extraordinary deals.',
    image: electronicsImg,
    bannerImage: electronicsBanner,
    subcategories: [
      { name: 'Mobile Phones', icon: '📱' },
      { name: 'Laptops & Computers', icon: '💻' },
      { name: 'Audio & Headphones', icon: '🎧' },
      { name: 'Cameras & Photography', icon: '📷' },
      { name: 'Gaming & Consoles', icon: '🎮' },
      { name: 'Smart Wearables', icon: '⌚' },
      { name: 'Accessories', icon: '🔌' },
    ],
    featured: [
      { name: 'MacBook Pro M3', price: '1,35,000', image: macbookImg, timeLeft: '2d 5h left', bids: 12 },
      { name: 'Sony Alpha A7 IV', price: '1,10,000', image: sonyImg, timeLeft: '1d 12h left', bids: 8 },
      { name: 'iPhone 15 Pro', price: '95,000', image: iphoneImg, timeLeft: '5h left', bids: 24 },
      { name: 'Bose QuietComfort', price: '18,500', image: boseImg, timeLeft: '3d 2h left', bids: 5 },
    ]
  },
  art_collectibles: {
    name: 'Art & Collectibles',
    tagline: 'Timeless pieces. Endless stories.',
    image: artImg,
    bannerImage: artBanner,
    subcategories: [
      { name: 'Paintings', icon: '🖼️' },
      { name: 'Sculptures', icon: '🗿' },
      { name: 'Coins & Currency', icon: '🪙' },
      { name: 'Stamps', icon: '📫' },
      { name: 'Rare Books', icon: '📚' },
      { name: 'Vintage Collectibles', icon: '🏺' },
      { name: 'Antiques', icon: '📻' },
    ],
    featured: [
      { name: 'Vintage Painting', price: '5,20,000', image: '/auctions/art/vintage-painting.png', timeLeft: '5d 1h left', bids: 3 },
      { name: 'Ancient Coin Set', price: '1,20,000', image: '/auctions/art/ancient-coin-set.png', timeLeft: '2d 4h left', bids: 7 },
      { name: 'Rare Stamp Collection', price: '60,000', image: '/auctions/art/rare-stamp-collection.png', timeLeft: '1d 8h left', bids: 15 },
      { name: 'Antique Vase', price: '1,75,000', image: '/auctions/art/antique-vase.png', timeLeft: '6d 12h left', bids: 2 },
    ]
  },
  fashion: {
    name: 'Fashion',
    tagline: 'Iconic styles. New possibilities.',
    image: fashionImg,
    bannerImage: fashionBanner,
    subcategories: [
      { name: "Women's", icon: '👗' },
      { name: "Men's", icon: '👔' },
      { name: 'Handbags', icon: '👜' },
      { name: 'Shoes', icon: '👞' },
      { name: 'Sunglasses', icon: '🕶️' },
      { name: 'Accessories', icon: '🧣' },
      { name: 'Designer Collections', icon: '✨' },
    ],
    featured: [
      { name: 'Louis Vuitton Handbag', price: '1,80,000', image: '/auctions/fashion/louis-vuitton-handbag.png', timeLeft: '1d 2h left', bids: 18 },
      { name: 'Gucci Sneakers', price: '75,000', image: '/auctions/fashion/gucci-sneakers.png', timeLeft: '3d 6h left', bids: 9 },
      { name: 'Designer Dress', price: '75,000', image: '/auctions/fashion/designer-dress.png', timeLeft: '4d 10h left', bids: 4 },
      { name: 'Ray-Ban Sunglasses', price: '1,19,000', image: '/auctions/fashion/ray-ban-sunglasses.png', timeLeft: '2d 1h left', bids: 11 },
    ]
  },
  jewelry_watches: {
    name: 'Jewelry & Watches',
    tagline: 'Exquisite craftsmanship. Lasting value.',
    image: jewelryImg,
    bannerImage: jewelryBanner,
    subcategories: [
      { name: 'Necklaces', icon: '📿' },
      { name: 'Rings', icon: '💍' },
      { name: 'Bracelets', icon: '⛓️' },
      { name: 'Earrings', icon: '✨' },
      { name: 'Watches', icon: '⌚' },
      { name: 'Gemstones', icon: '💎' },
      { name: 'Luxury Collections', icon: '👑' },
    ],
    featured: [
      { name: 'Diamond Necklace', price: '5,50,000', image: '/auctions/jewelry/diamond-necklace.png', timeLeft: '4d 5h left', bids: 6 },
      { name: 'Rolex Submariner', price: '8,25,000', image: '/auctions/jewelry/rolex-submariner.png', timeLeft: '1d 12h left', bids: 22 },
      { name: 'Emerald Ring', price: '3,10,000', image: '/auctions/jewelry/emerald-ring.png', timeLeft: '3d 8h left', bids: 14 },
      { name: 'Gold Bracelet', price: '1,15,000', image: '/auctions/jewelry/gold-bracelet.png', timeLeft: '5d 2h left', bids: 8 },
    ]
  },
  home_garden: {
    name: 'Home & Garden',
    tagline: 'Beautiful spaces. Better living.',
    image: homeImg,
    bannerImage: homeBanner,
    subcategories: [
      { name: 'Furniture', icon: '🪑' },
      { name: 'Home Décor', icon: '🪴' },
      { name: 'Lighting', icon: '💡' },
      { name: 'Kitchen & Dining', icon: '🍽️' },
      { name: 'Garden & Outdoors', icon: '🌻' },
      { name: 'Tools & Improvement', icon: '🛠️' },
      { name: 'Collectibles', icon: '🏺' },
    ],
    featured: [
      { name: 'Designer Sofa', price: '1,85,000', image: '/auctions/home/designer-sofa.png', timeLeft: '2d 11h left', bids: 5 },
      { name: 'Chandelier', price: '65,000', image: '/auctions/home/chandelier.png', timeLeft: '1d 4h left', bids: 12 },
      { name: 'Outdoor Dining Set', price: '1,10,000', image: '/auctions/home/outdoor-dining-set.png', timeLeft: '4d 2h left', bids: 7 },
      { name: 'Vintage Decor', price: '45,000', image: '/auctions/home/vintage-decor.png', timeLeft: '6d 5h left', bids: 3 },
    ]
  },
  sports: {
    name: 'Sports',
    tagline: 'Legends. Memorabilia. Moments.',
    image: sportsImg,
    bannerImage: sportsBanner,
    subcategories: [
      { name: 'Cricket', icon: '🏏' },
      { name: 'Football', icon: '⚽' },
      { name: 'Basketball', icon: '🏀' },
      { name: 'Tennis', icon: '🎾' },
      { name: 'Golf', icon: '⛳' },
      { name: 'Fitness Equipment', icon: '🏋️' },
      { name: 'Memorabilia', icon: '🏆' },
    ],
    featured: [
      { name: 'Signed Cricket Bat', price: '2,20,000', image: '/auctions/sports/signed-cricket-bat.png', timeLeft: '3d 1h left', bids: 25 },
      { name: 'Goalkeeper Gloves', price: '18,500', image: '/auctions/sports/goalkeeper-gloves.png', timeLeft: '1d 8h left', bids: 42 },
      { name: 'Wilson Basketball', price: '45,000', image: '/auctions/sports/wilson-basketball.png', timeLeft: '2d 12h left', bids: 8 },
      { name: 'Tennis Racket', price: '25,000', image: '/auctions/sports/tennis-racket.png', timeLeft: '5d 4h left', bids: 4 },
    ]
  },
  stationery_office: {
    name: 'Stationery & Office',
    tagline: 'Work smarter. Live better.',
    image: sportsImg, // Same as sports as per instructions
    bannerImage: stationeryBanner,
    subcategories: [
      { name: 'Notebooks & Journals', icon: '📔' },
      { name: 'Pens & Writing', icon: '🖊️' },
      { name: 'Office Supplies', icon: '📎' },
      { name: 'Office Furniture', icon: '🪑' },
      { name: 'Printers & Scanners', icon: '🖨️' },
      { name: 'Organization', icon: '🗂️' },
      { name: 'Art Supplies', icon: '🎨' },
    ],
    featured: [
      { name: 'Montblanc Pen', price: '15,000', image: '/auctions/stationery/montblanc-pen.png', timeLeft: '2d 6h left', bids: 16 },
      { name: 'Ergonomic Chair', price: '28,000', image: '/auctions/stationery/ergonomic-chair.png', timeLeft: '4d 2h left', bids: 9 },
      { name: 'Premium Notebook Set', price: '12,000', image: '/auctions/stationery/premium-notebook-set.png', timeLeft: '1d 10h left', bids: 14 },
      { name: 'Desk Organizer', price: '8,500', image: '/auctions/stationery/desk-organizer.png', timeLeft: '3d 5h left', bids: 7 },
    ]
  }
};

export default function CategoryDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const category = useMemo(() => {
    if (!slug || slug === 'all' || !categoryData[slug as keyof typeof categoryData]) {
      return null; // Handle all categories view or not found if needed
    }
    return categoryData[slug as keyof typeof categoryData];
  }, [slug]);

  if (!category) {
    if (slug === 'all') {
      return <AllCategories />;
    }
    return (
      <div className="home category-dashboard">
        <HomeHeader />
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Category Not Found</h2>
        </div>
      </div>
    );
  }


  return (
    <div className="home category-dashboard">
      <HomeHeader />
      
      {/* Hero Banner */}
      {/* Hero Banner */}
      <section className="category-hero" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#0e0b11' }}>
        {'bannerImage' in category && category.bannerImage && (
          <img 
            src={category.bannerImage as string} 
            alt={category.name} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }} 
          />
        )}
        
        <div className="category-hero-content" style={{ position: 'relative', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          <h1>
            {category.name.includes('&') ? (
              <>
                {category.name.split('&')[0]} &<br />
                <em>{category.name.split('&')[1].trim()}</em>
              </>
            ) : (
              <em>{category.name}</em>
            )}
          </h1>
          <p>{category.tagline}</p>
          <button className="explore-btn" style={{ textShadow: 'none' }}>Explore Auctions →</button>
        </div>
        
        {(!('bannerImage' in category) || !category.bannerImage) && (
          <div className="category-hero-image" style={{ position: 'relative', zIndex: 1 }}>
            <img src={category.image} alt={category.name} />
          </div>
        )}
      </section>

      {/* Subcategories Row */}
      <section className="subcategories-section">
        <div className="subcategories-scroll">
          {category.subcategories.map((sub, index) => (
            <div key={index} className="subcategory-item">
              <div className="subcategory-icon">{sub.icon}</div>
              <span className="subcategory-label">{sub.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="featured-auctions-section">
        <div className="featured-header">
          <h2>Featured {category.name} Auctions</h2>
          <Link to={`/auctions?category=${slug}`} className="view-all-link">View All →</Link>
        </div>
        
        <div className="featured-cards-scroll">
          {category.featured.map((product, index) => (
            <Link to={`/auctions/${slug}-demo-${index}`} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-card" style={{ position: 'relative' }}>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist({
                      id: `${slug}-${index}`,
                      title: product.name,
                      category: category.name,
                      price: `₹ ${product.price}`,
                      time: product.timeLeft,
                      urgent: product.timeLeft.includes('h'),
                      label: 'LIVE',
                      image: product.image
                    });
                  }}
                  style={{
                    position: 'absolute', top: '10px', right: '10px', zIndex: 10,
                    background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer',
                    color: isInWishlist(`${slug}-${index}`) ? '#e91e63' : 'rgba(255,255,255,0.8)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  ♥
                </button>
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">₹{product.price}</div>
                  <div className="product-meta">
                    <span className="time-left">⏱ {product.timeLeft}</span>
                    <span className="bids-count">🔨 {product.bids} bids</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
