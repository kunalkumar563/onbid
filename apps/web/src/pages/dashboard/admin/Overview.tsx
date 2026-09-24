
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AdminDashboard.css';
import { useAuth } from '../../../context/AuthContext';

export default function Overview() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        <div className="admin-header-row">
          <div>
            <h1>Welcome back, <em>{user?.fullName || 'Admin User'}</em> 👋</h1>
            <p>Here's what's happening on your auction platform today.</p>
          </div>
          <div style={{background: 'white', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px', fontWeight: 600}}>
            📅 Thu, 24 Sep 2025
          </div>
        </div>

        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon" style={{background: '#e8f5e9', color: '#2e7d32'}}>👤</div>
            </div>
            <div className="admin-stat-value">356</div>
            <div className="admin-stat-label">Total Users</div>
            <div className="admin-stat-trend trend-up">↑ 12%</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon" style={{background: '#e3f2fd', color: '#1976d2'}}>📦</div>
            </div>
            <div className="admin-stat-value">124</div>
            <div className="admin-stat-label">Live Auctions</div>
            <div className="admin-stat-trend trend-up">↑ 8%</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon" style={{background: '#f3e5f5', color: '#ab47bc'}}>₹</div>
            </div>
            <div className="admin-stat-value">₹ 24,50,000</div>
            <div className="admin-stat-label">Total Revenue</div>
            <div className="admin-stat-trend trend-up">↑ 18%</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon" style={{background: '#ffebee', color: '#d32f2f'}}>⚠️</div>
            </div>
            <div className="admin-stat-value">12</div>
            <div className="admin-stat-label">Open Disputes</div>
            <div className="admin-stat-trend trend-down">↓ 4%</div>
          </div>
        </div>

        <div style={{display: 'flex', gap: '30px', marginBottom: '30px'}}>
          <div className="admin-section" style={{flex: 2, margin: 0}}>
            <div className="admin-section-header">
              <h2>Revenue Overview</h2>
              <select className="ad-btn" style={{padding: '4px 10px', fontSize: '12px'}}><option>Last 7 Days</option></select>
            </div>
            <div className="ad-chart-placeholder" style={{background: 'linear-gradient(to top, rgba(75, 42, 181, 0.1), transparent)'}}>
              <div style={{width: '100%', height: '2px', background: '#4b2ab5', position: 'relative', top: '20px', transform: 'rotate(-5deg)'}}>
                <div style={{position: 'absolute', right: '40px', top: '-30px', background: '#1a1025', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px'}}>₹ 3,20,000</div>
                <div style={{width: '8px', height: '8px', background: '#4b2ab5', borderRadius: '50%', position: 'absolute', right: '60px', top: '-3px'}}></div>
              </div>
            </div>
          </div>
          
          <div className="admin-section" style={{flex: 1, margin: 0}}>
            <div className="admin-section-header">
              <h2>User Distribution</h2>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '20px', height: '200px'}}>
              <div className="ad-circle-chart">
                <span style={{fontSize: '24px', fontWeight: 'bold', color: '#1a1025'}}>356</span>
                <span style={{fontSize: '11px', color: '#666'}}>Users</span>
              </div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px'}}><span style={{color: '#4b2ab5'}}>● Bidders</span> <span>62%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px'}}><span style={{color: '#e91e63'}}>● Sellers</span> <span>28%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px'}}><span style={{color: '#ff9800'}}>● Verifiers</span> <span>7%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px'}}><span style={{color: '#03a9f4'}}>● Auctioneers</span> <span>2%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}><span style={{color: '#333'}}>● Admins</span> <span>1%</span></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{display: 'flex', gap: '30px'}}>
          <div className="admin-section" style={{flex: 2, margin: 0, padding: 0}}>
            <div className="admin-section-header" style={{padding: '25px 25px 0'}}>
              <h2>Recent Activities</h2>
            </div>
            <div style={{padding: '0 25px 25px'}}>
              <div className="ad-activity-item">
                <div className="ad-activity-icon">👤</div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: '13px', fontWeight: 600, color: '#1a1025'}}>New user registered</div>
                  <div style={{fontSize: '12px', color: '#666'}}>rahul.s@example.com</div>
                </div>
                <div style={{fontSize: '11px', color: '#888'}}>2 mins ago</div>
              </div>
              <div className="ad-activity-item">
                <div className="ad-activity-icon">📦</div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: '13px', fontWeight: 600, color: '#1a1025'}}>New auction created</div>
                  <div style={{fontSize: '12px', color: '#666'}}>Vintage Watch by Priya Mehta</div>
                </div>
                <div style={{fontSize: '11px', color: '#888'}}>15 mins ago</div>
              </div>
              <div className="ad-activity-item">
                <div className="ad-activity-icon">💰</div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: '13px', fontWeight: 600, color: '#1a1025'}}>Bid placed</div>
                  <div style={{fontSize: '12px', color: '#666'}}>₹ 2,50,000 on Antique Vase</div>
                </div>
                <div style={{fontSize: '11px', color: '#888'}}>28 mins ago</div>
              </div>
            </div>
          </div>
          
          <div className="admin-section" style={{flex: 1, margin: 0}}>
            <div className="admin-section-header">
              <h2>Quick Actions</h2>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <button className="ad-btn" style={{textAlign: 'left', padding: '12px 15px', color: '#1a1025'}}>👤 Add New User</button>
              <button className="ad-btn" style={{textAlign: 'left', padding: '12px 15px', color: '#1a1025'}}>📦 Create Auction</button>
              <button className="ad-btn" style={{textAlign: 'left', padding: '12px 15px', color: '#1a1025'}}>✓ Review Verifications</button>
              <button className="ad-btn" style={{textAlign: 'left', padding: '12px 15px', color: '#1a1025'}}>📊 View Reports</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
