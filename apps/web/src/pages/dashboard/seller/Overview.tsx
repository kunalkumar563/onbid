
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './SellerDashboard.css';
import { useAuth } from '../../../context/AuthContext';

export default function Overview() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout role="seller">
      <div className="seller-page">
        <div className="seller-header-row">
          <div>
            <span style={{fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '1px'}}>SELLER WORKSPACE</span>
            <h1>Welcome Back, <em>{user?.fullName || 'Test User'}</em> 👋</h1>
            <p>Manage your listings, track auctions and grow your collection.</p>
          </div>
          <div style={{background: 'white', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px', fontWeight: 600}}>
            📅 Thu, 24 Sep 2025
          </div>
        </div>

        <div className="seller-stats-row">
          <div className="seller-stat-card">
            <div className="seller-stat-header">
              <div className="seller-stat-icon" style={{background: '#f3e5f5', color: '#ab47bc'}}>📋</div>
            </div>
            <div className="seller-stat-value">12</div>
            <div className="seller-stat-label">Total Listings</div>
          </div>
          <div className="seller-stat-card">
            <div className="seller-stat-header">
              <div className="seller-stat-icon" style={{background: '#e3f2fd', color: '#1976d2'}}>🔥</div>
            </div>
            <div className="seller-stat-value">8</div>
            <div className="seller-stat-label">Active Auctions</div>
          </div>
          <div className="seller-stat-card">
            <div className="seller-stat-header">
              <div className="seller-stat-icon" style={{background: '#fff8e1', color: '#ffb300'}}>🛡️</div>
            </div>
            <div className="seller-stat-value">3</div>
            <div className="seller-stat-label">Under Review</div>
          </div>
          <div className="seller-stat-card">
            <div className="seller-stat-header">
              <div className="seller-stat-icon" style={{background: '#e8f5e9', color: '#2e7d32'}}>₹</div>
            </div>
            <div className="seller-stat-value">₹ 2,45,000</div>
            <div className="seller-stat-label">Total Earnings</div>
          </div>
        </div>

        <div className="s-hero-box">
          <div className="s-hero-content">
            <h2>List Extraordinary Items.</h2>
            <p>Reach a global community of collectors.</p>
            <Link to="/listings/create" className="s-btn s-btn-primary" style={{textDecoration: 'none', display: 'inline-block'}}>Create New Listing →</Link>
          </div>
          <img src="/auctions/jewelry/jewelry-01.png" className="s-hero-img" />
        </div>

        <div className="seller-section" style={{padding: 0}}>
          <div className="seller-section-header" style={{padding: '25px 25px 0'}}>
            <h2>Recent Activity</h2>
            <Link to="/dashboard/seller/listings" className="s-btn-link">View All →</Link>
          </div>
          <table className="seller-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
                <th>Bids</th>
                <th>Views</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="s-item-cell">
                    <img src="/auctions/home/home-01.png" className="s-item-img"/>
                    <span style={{fontWeight: 600}}>Vintage Crystal Chandelier</span>
                  </div>
                </td>
                <td><span className="seller-badge badge-active">Active</span></td>
                <td>12</td>
                <td>245</td>
                <td>Sep 22, 2025</td>
              </tr>
              <tr>
                <td>
                  <div className="s-item-cell">
                    <img src="/auctions/jewelry/jewelry-01.png" className="s-item-img"/>
                    <span style={{fontWeight: 600}}>Rolex Datejust Watch</span>
                  </div>
                </td>
                <td><span className="seller-badge badge-under-review">Under Review</span></td>
                <td>-</td>
                <td>189</td>
                <td>Sep 21, 2025</td>
              </tr>
              <tr>
                <td>
                  <div className="s-item-cell">
                    <img src="/auctions/art/art-01.png" className="s-item-img"/>
                    <span style={{fontWeight: 600}}>Modern Art Painting</span>
                  </div>
                </td>
                <td><span className="seller-badge badge-ended">Ended</span></td>
                <td>28</td>
                <td>320</td>
                <td>Sep 18, 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
