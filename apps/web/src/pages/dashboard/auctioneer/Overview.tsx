
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';
import { useAuth } from '../../../context/AuthContext';

export default function Overview() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Welcome back, <em>{user?.fullName || 'Test User'}</em> 👋</h1>
            <p>Manage, monitor and run auctions seamlessly.</p>
          </div>
          <div style={{background: 'white', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px', fontWeight: 600}}>
            📅 Thu, 24 Sep 2025
          </div>
        </div>

        <div className="auct-stats-row">
          <div className="auct-stat-card">
            <div className="auct-stat-header">
              <div className="auct-stat-icon" style={{background: '#fcf9f5', color: '#4b2ab5'}}>📦</div>
            </div>
            <div className="auct-stat-value">24</div>
            <div className="auct-stat-label">Total Auctions</div>
          </div>
          <div className="auct-stat-card">
            <div className="auct-stat-header">
              <div className="auct-stat-icon" style={{background: '#e8f5e9', color: '#2e7d32'}}>🔴</div>
            </div>
            <div className="auct-stat-value">6</div>
            <div className="auct-stat-label">Live Now</div>
          </div>
          <div className="auct-stat-card">
            <div className="auct-stat-header">
              <div className="auct-stat-icon" style={{background: '#e3f2fd', color: '#1976d2'}}>📅</div>
            </div>
            <div className="auct-stat-value">12</div>
            <div className="auct-stat-label">Scheduled</div>
          </div>
          <div className="auct-stat-card">
            <div className="auct-stat-header">
              <div className="auct-stat-icon" style={{background: '#ffebee', color: '#d32f2f'}}>✓</div>
            </div>
            <div className="auct-stat-value">8</div>
            <div className="auct-stat-label">Ended</div>
          </div>
        </div>

        <div className="a-hero-box">
          <div className="a-hero-content">
            <h2>Curate Extraordinary<br/>Auctions</h2>
            <Link to="/dashboard/auctioneer/auctions/create" className="a-btn a-btn-primary" style={{textDecoration: 'none', display: 'inline-block', marginTop: '20px'}}>Create Auction +</Link>
          </div>
          <img src="/auctions/jewelry/jewelry-01.png" className="a-hero-img" />
        </div>

        <div className="auct-section" style={{padding: '25px', background: 'transparent', border: 'none', boxShadow: 'none'}}>
          <div className="auct-section-header">
            <h2>Recent Auctions</h2>
            <Link to="/dashboard/auctioneer/auctions" className="a-btn-link">View All →</Link>
          </div>
          
          <div className="a-auction-grid">
            <div className="a-auction-card">
              <div className="a-auction-img-wrapper">
                <img src="/auctions/home/home-01.png" className="a-auction-img" />
                <div className="a-live-badge">LIVE</div>
              </div>
              <div className="a-auction-content">
                <h3 className="a-auction-title">Vintage Chandelier</h3>
                <div className="a-auction-details">
                  <div>
                    <div className="a-auction-price">₹ 1,25,000</div>
                    <div className="a-auction-label" style={{color: '#d32f2f', fontWeight: 600}}>2h 15m left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="a-auction-label">12 bids</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="a-auction-card">
              <div className="a-auction-img-wrapper">
                <img src="/auctions/jewelry/jewelry-01.png" className="a-auction-img" />
                <div className="a-live-badge" style={{background: '#d32f2f'}}>ENDING SOON</div>
              </div>
              <div className="a-auction-content">
                <h3 className="a-auction-title">Rolex Datejust</h3>
                <div className="a-auction-details">
                  <div>
                    <div className="a-auction-price">₹ 4,20,000</div>
                    <div className="a-auction-label" style={{color: '#d32f2f', fontWeight: 600}}>12m left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="a-auction-label">32 bids</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="a-auction-card">
              <div className="a-auction-img-wrapper">
                <img src="/auctions/art/art-01.png" className="a-auction-img" />
                <div className="a-live-badge" style={{background: '#1976d2'}}>SCHEDULED</div>
              </div>
              <div className="a-auction-content">
                <h3 className="a-auction-title">Modern Art Painting</h3>
                <div className="a-auction-details">
                  <div>
                    <div className="a-auction-price">₹ 85,000</div>
                    <div className="a-auction-label">Starts in 1d</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="a-auction-label">-</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="a-auction-card">
              <div className="a-auction-img-wrapper">
                <img src="/auctions/home/home-01.png" className="a-auction-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/>
                <div className="a-live-badge" style={{background: '#333'}}>ENDED</div>
              </div>
              <div className="a-auction-content">
                <h3 className="a-auction-title">Antique Vase</h3>
                <div className="a-auction-details">
                  <div>
                    <div className="a-auction-price">₹ 62,000</div>
                    <div className="a-auction-label" style={{color: '#333', fontWeight: 600}}>Ended</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="a-auction-label">28 bids</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
