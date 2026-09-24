
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './VerifierDashboard.css';
import { useAuth } from '../../../context/AuthContext';

export default function Overview() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout role="verifier">
      <div className="verifier-page">
        <div className="verifier-header-row">
          <div>
            <span style={{fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '1px'}}>VERIFIER WORKSPACE</span>
            <h1>Welcome back, <em>{user?.fullName || 'Test User'}</em>.</h1>
            <p>Review, verify, and ensure authenticity for a trusted marketplace.</p>
          </div>
          <div style={{background: 'white', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px', fontWeight: 600}}>
            📅 Thu, 24 Sep 2025
          </div>
        </div>

        <div className="verifier-stats-row">
          <div className="verifier-stat-card">
            <div className="verifier-stat-header">
              <div className="verifier-stat-icon" style={{background: '#fff8e1', color: '#ffb300'}}>⏳</div>
            </div>
            <div className="verifier-stat-value">24</div>
            <div className="verifier-stat-label">Pending Review</div>
          </div>
          <div className="verifier-stat-card">
            <div className="verifier-stat-header">
              <div className="verifier-stat-icon" style={{background: '#e3f2fd', color: '#1976d2'}}>📅</div>
            </div>
            <div className="verifier-stat-value">8</div>
            <div className="verifier-stat-label">Scheduled Today</div>
          </div>
          <div className="verifier-stat-card">
            <div className="verifier-stat-header">
              <div className="verifier-stat-icon" style={{background: '#e8f5e9', color: '#2e7d32'}}>✅</div>
            </div>
            <div className="verifier-stat-value">52</div>
            <div className="verifier-stat-label">Completed</div>
          </div>
          <div className="verifier-stat-card">
            <div className="verifier-stat-header">
              <div className="verifier-stat-icon" style={{background: '#ffebee', color: '#d32f2f'}}>❌</div>
            </div>
            <div className="verifier-stat-value">6</div>
            <div className="verifier-stat-label">Rejected</div>
          </div>
        </div>

        <div className="verifier-section">
          <div className="verifier-section-header">
            <h2>Recent Submissions</h2>
            <Link to="/dashboard/verifier/queue" style={{color: '#4b2ab5', textDecoration: 'none', fontSize: '14px', fontWeight: 600}}>View All →</Link>
          </div>
          <div className="verifier-grid">
            <div className="verifier-card">
              <img src="/auctions/jewelry/jewelry-01.png" className="verifier-card-img" />
              <div className="verifier-card-content">
                <h3 className="verifier-card-title">Rolex Datejust Watch</h3>
                <p className="verifier-card-subtitle">Watches & Jewelry</p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
                  <span style={{fontSize: '11px', color: '#888'}}>Rahul S. • 3 hours ago</span>
                  <span className="verifier-badge badge-pending">Pending</span>
                </div>
              </div>
            </div>
            <div className="verifier-card">
              <img src="/auctions/art/art-01.png" className="verifier-card-img" />
              <div className="verifier-card-content">
                <h3 className="verifier-card-title">Modern Art Painting</h3>
                <p className="verifier-card-subtitle">Art & Collectibles</p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
                  <span style={{fontSize: '11px', color: '#888'}}>Priya M. • 6 hours ago</span>
                  <span className="verifier-badge badge-pending">Pending</span>
                </div>
              </div>
            </div>
            <div className="verifier-card">
              <img src="/auctions/fashion/fashion-01.png" className="verifier-card-img" />
              <div className="verifier-card-content">
                <h3 className="verifier-card-title">Louis Vuitton Handbag</h3>
                <p className="verifier-card-subtitle">Fashion</p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
                  <span style={{fontSize: '11px', color: '#888'}}>Amit K. • 8 hours ago</span>
                  <span className="verifier-badge badge-pending">Pending</span>
                </div>
              </div>
            </div>
            <div className="verifier-card">
              <img src="/auctions/home/home-01.png" className="verifier-card-img" />
              <div className="verifier-card-content">
                <h3 className="verifier-card-title">Antique Vase</h3>
                <p className="verifier-card-subtitle">Home & Decor</p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
                  <span style={{fontSize: '11px', color: '#888'}}>Sneha R. • 9 hours ago</span>
                  <span className="verifier-badge badge-pending">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
