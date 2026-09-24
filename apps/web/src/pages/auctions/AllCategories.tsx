import React from 'react';
import { Link } from 'react-router-dom';
import HomeHeader from '../home/HomeHeader';
import './AllCategories.css';

const categories = [
  { id: 'electronics', name: 'Electronics', desc: 'Latest tech, gadgets and more.', img: '/auctions/electronics/electronics-01.png' },
  { id: 'art_collectibles', name: 'Art & Collectibles', desc: 'Rare art, antiques and unique finds.', img: '/auctions/art/art-01.png' },
  { id: 'fashion', name: 'Fashion', desc: 'Luxury fashion and designer pieces.', img: '/auctions/fashion/fashion-01.png' },
  { id: 'jewelry_watches', name: 'Jewelry & Watches', desc: 'Exquisite jewelry and timepieces.', img: '/auctions/jewelry/jewelry-01.png' },
  { id: 'home_garden', name: 'Home & Garden', desc: 'Elevate your living space.', img: '/auctions/home/home-01.png' },
  { id: 'sports', name: 'Sports', desc: 'Gear up for greatness.', img: '/auctions/sports/sports-01.png' },
  { id: 'stationery_office', name: 'Stationery & Office', desc: 'Premium tools for productivity.', img: '/auctions/stationery/stationery-banner.png' },
  { id: 'vehicles', name: 'Vehicles & Accessories', desc: 'Cars, bikes and premium accessories.', img: '/auctions/vehicles/vehicles-01.png' }
];

const trending = [
  { id: 'home_garden-demo-1', name: 'Crystal Chandelier', desc: 'Elegant lighting for modern spaces.', price: '₹65,000', time: '02d 14h', img: '/auctions/home/chandelier.png', status: 'LIVE' },
  { id: 'art_collectibles-demo-0', name: 'Vintage Abstract Painting', desc: 'Rare collectible art piece.', price: '₹1,25,000', time: '04h 32m', img: '/auctions/art/vintage-painting.png', status: 'Ending Soon' },
  { id: 'fashion-demo-1', name: 'Nike Air Jordan 1 (Limited)', desc: 'Iconic sneakers for collectors.', price: '₹48,000', time: '01d 03h', img: '/auctions/fashion/gucci-sneakers.png', status: 'LIVE' },
  { id: 'jewelry_watches-demo-1', name: 'Rolex Datejust', desc: 'Classic elegance, timeless value.', price: '₹6,80,000', time: '06h 12m', img: '/auctions/jewelry/rolex-submariner.png', status: 'Ending Soon' }
];

const recent = [
  '/auctions/home/chandelier.png',
  '/auctions/jewelry/rolex-submariner.png',
  '/auctions/fashion/louis-vuitton-handbag.png',
  '/auctions/art/vintage-painting.png',
  '/auctions/vehicles/vehicles-01.png',
  '/auctions/fashion/gucci-sneakers.png'
];

export default function AllCategories() {
  return (
    <div className="home all-categories-page">
      <HomeHeader />
      
      {/* Hero Section */}
      <section className="ac-hero">
        <div className="ac-hero-left">
          <div className="ac-hero-kicker">A World of Extraordinary Finds</div>
          <h1>Explore All<br/><em>Categories</em></h1>
          <p>
            Discover unique auctions across timeless categories.<br/>
            From rare collectibles to modern essentials, ONBID brings<br/>
            together exceptional items for every interest.
          </p>
          <button className="ac-btn-primary">Start Exploring &rarr;</button>
          
          <div className="ac-stats">
            <div>
              <span className="ac-stat-num">8</span>
              <span className="ac-stat-label">Categories</span>
            </div>
            <div>
              <span className="ac-stat-num">10K+</span>
              <span className="ac-stat-label">Live Auctions</span>
            </div>
            <div>
              <span className="ac-stat-num">50K+</span>
              <span className="ac-stat-label">Happy Collectors</span>
            </div>
          </div>
        </div>
        <div className="ac-hero-right">
          <div className="ac-hero-arch">
            {/* Using a composite layout or just one strong image. I'll use jewelry-01 as it has watches/luxury */}
            <img src="/auctions/jewelry/jewelry-01.png" alt="Hero Collage" />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="ac-section">
        <div className="ac-section-header">
          <div>
            <div className="ac-section-kicker">Discover by interest</div>
            <h2 className="ac-section-title">All Categories</h2>
          </div>
          <div className="ac-section-controls">
            <span>Explore something extraordinary.</span>
            <div className="ac-arrows">
              <button className="ac-arrow">&lt;</button>
              <button className="ac-arrow">&gt;</button>
            </div>
          </div>
        </div>
        
        <div className="ac-grid">
          {categories.map(cat => (
            <Link to={`/category/${cat.id}`} key={cat.id} className="ac-cat-card">
              <img src={cat.img} alt={cat.name} className="ac-cat-img" />
              <div className="ac-cat-info">
                <div>
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                </div>
                <div className="ac-explore-link">Explore &rarr;</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Auctions */}
      <div className="ac-trending-wrapper">
        <section className="ac-section">
          <div className="ac-section-header">
            <div>
              <div className="ac-section-kicker">Trending right now</div>
              <h2 className="ac-section-title">Trending Auctions</h2>
            </div>
            <button className="ac-view-all-btn">View All Auctions &rarr;</button>
          </div>

          <div className="ac-grid">
            {trending.map((item, i) => (
              <Link to={`/auctions/${item.id}`} key={i} className="ac-trending-card">
                <div className="ac-trending-img-wrapper">
                  <div className={`ac-badge ${item.status === 'LIVE' ? 'live' : 'ending'}`}>
                    {item.status}
                  </div>
                  <button className="ac-trending-like">♡</button>
                  <img src={item.img} alt={item.name} className="ac-trending-img" />
                </div>
                <div className="ac-trending-info">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                  <div className="ac-trending-stats">
                    <div className="ac-stat-box">
                      <span className="val">{item.price}</span>
                      <span className="lbl">Current Bid</span>
                    </div>
                    <div className="ac-stat-box" style={{textAlign: 'right'}}>
                      <span className="val">{item.time}</span>
                      <span className="lbl">Time Left</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Recently Viewed */}
      <section className="ac-section">
        <div className="ac-section-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span style={{fontSize: '24px'}}>🕒</span>
            <h2 className="ac-section-title" style={{fontSize: '24px'}}>Recently Viewed</h2>
            <span style={{color: '#666', marginLeft: '10px', fontSize: '14px'}}>Pick up where you left off.</span>
          </div>
          <button className="ac-view-all-btn">View All &rarr;</button>
        </div>
        
        <div className="ac-recent-grid">
          {recent.map((img, i) => (
            <div key={i} className="ac-recent-item">
              <img src={img} alt="Recent" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
