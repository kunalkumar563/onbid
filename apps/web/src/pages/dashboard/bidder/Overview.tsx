
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';
import { useAuth } from '../../../context/AuthContext';

export default function Overview() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <span style={{fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '1px'}}>YOUR BIDDING EXPERIENCE</span>
            <h1>Welcome back, <em>{user?.fullName || 'Test User'}</em> 👋</h1>
            <p>Discover extraordinary items. Place your bids. Be part of a global community.</p>
          </div>
          <div style={{background: 'white', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px', fontWeight: 600}}>
            📅 Thu, 24 Sep 2025
          </div>
        </div>

        <div className="bidder-stats-row">
          <div className="bidder-stat-card">
            <div className="bidder-stat-header">
              <div className="bidder-stat-icon" style={{background: '#e3f2fd', color: '#1976d2'}}>🔨</div>
            </div>
            <div className="bidder-stat-value">12</div>
            <div className="bidder-stat-label">Active Bids</div>
          </div>
          <div className="bidder-stat-card">
            <div className="bidder-stat-header">
              <div className="bidder-stat-icon" style={{background: '#f3e5f5', color: '#ab47bc'}}>❤️</div>
            </div>
            <div className="bidder-stat-value">8</div>
            <div className="bidder-stat-label">Watchlisted</div>
          </div>
          <div className="bidder-stat-card">
            <div className="bidder-stat-header">
              <div className="bidder-stat-icon" style={{background: '#e8f5e9', color: '#2e7d32'}}>🏆</div>
            </div>
            <div className="bidder-stat-value">3</div>
            <div className="bidder-stat-label">Won Auctions</div>
          </div>
          <div className="bidder-stat-card">
            <div className="bidder-stat-header">
              <div className="bidder-stat-icon" style={{background: '#fff8e1', color: '#ffb300'}}>📦</div>
            </div>
            <div className="bidder-stat-value">2</div>
            <div className="bidder-stat-label">Orders</div>
          </div>
          <div className="bidder-stat-card">
            <div className="bidder-stat-header">
              <div className="bidder-stat-icon" style={{background: '#fcf9f5', color: '#4b2ab5'}}>₹</div>
            </div>
            <div className="bidder-stat-value" style={{fontSize: '20px'}}>₹ 2,45,000</div>
            <div className="bidder-stat-label">Total Spending</div>
          </div>
        </div>

        <div className="b-hero-box">
          <div className="b-hero-content">
            <h2>Extraordinary.<br/>World of Stories.</h2>
            <Link to="/dashboard/bidder/auctions" className="b-btn b-btn-primary" style={{textDecoration: 'none', display: 'inline-block', marginTop: '20px'}}>Explore Live Auctions →</Link>
          </div>
          <img src="/auctions/jewelry/jewelry-01.png" className="b-hero-img" />
        </div>

        <div className="bidder-section" style={{padding: '25px', background: 'transparent', border: 'none', boxShadow: 'none'}}>
          <div className="bidder-section-header">
            <h2>Live Auctions</h2>
            <Link to="/dashboard/bidder/auctions" className="b-btn-link">View All →</Link>
          </div>
          
          <div className="b-auction-grid">
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/home/home-01.png" className="b-auction-img" />
                <div className="b-live-badge">LIVE</div>
                <button className="b-watchlist-btn">♡</button>
              </div>
              <div className="b-auction-content">
                <h3 className="b-auction-title">Vintage Crystal Chandelier</h3>
                <div className="b-auction-details">
                  <div>
                    <div className="b-auction-price">₹ 1,25,000</div>
                    <div className="b-auction-label" style={{color: '#d32f2f', fontWeight: 600}}>4h 32m left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="b-auction-label">24 bids</div>
                  </div>
                </div>
                <button className="b-btn b-btn-primary" style={{width: '100%'}}>Place Bid</button>
              </div>
            </div>
            
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/jewelry/jewelry-01.png" className="b-auction-img" />
                <div className="b-ending-badge">ENDING SOON</div>
                <button className="b-watchlist-btn">♡</button>
              </div>
              <div className="b-auction-content">
                <h3 className="b-auction-title">Rolex Datejust Watch</h3>
                <div className="b-auction-details">
                  <div>
                    <div className="b-auction-price">₹ 4,20,000</div>
                    <div className="b-auction-label" style={{color: '#d32f2f', fontWeight: 600}}>2h 15m left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="b-auction-label">32 bids</div>
                  </div>
                </div>
                <button className="b-btn b-btn-primary" style={{width: '100%'}}>Place Bid</button>
              </div>
            </div>
            
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/art/art-01.png" className="b-auction-img" />
                <div className="b-live-badge">LIVE</div>
                <button className="b-watchlist-btn">♡</button>
              </div>
              <div className="b-auction-content">
                <h3 className="b-auction-title">Modern Art Painting</h3>
                <div className="b-auction-details">
                  <div>
                    <div className="b-auction-price">₹ 85,000</div>
                    <div className="b-auction-label">1d 6h left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="b-auction-label">18 bids</div>
                  </div>
                </div>
                <button className="b-btn b-btn-primary" style={{width: '100%'}}>Place Bid</button>
              </div>
            </div>
            
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/home/home-01.png" className="b-auction-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/>
                <div className="b-live-badge">LIVE</div>
                <button className="b-watchlist-btn">♡</button>
              </div>
              <div className="b-auction-content">
                <h3 className="b-auction-title">Antique Vase</h3>
                <div className="b-auction-details">
                  <div>
                    <div className="b-auction-price">₹ 62,000</div>
                    <div className="b-auction-label">3d 12h left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="b-auction-label">11 bids</div>
                  </div>
                </div>
                <button className="b-btn b-btn-primary" style={{width: '100%'}}>Place Bid</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
