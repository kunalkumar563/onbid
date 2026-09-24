
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AdminDashboard.css';

export default function Reports() {
  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        <div className="admin-header-row">
          <div>
            <h1>Reports & Analytics</h1>
            <p>Track platform performance and generate insights.</p>
          </div>
          <select className="ad-btn"><option>Sep 1, 2025 - Sep 30, 2025 ▾</option></select>
        </div>
        
        <div className="admin-stats-row">
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
              <div className="admin-stat-icon" style={{background: '#e3f2fd', color: '#1976d2'}}>📦</div>
            </div>
            <div className="admin-stat-value">124</div>
            <div className="admin-stat-label">Total Auctions</div>
            <div className="admin-stat-trend trend-up">↑ 12%</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon" style={{background: '#e8f5e9', color: '#2e7d32'}}>👤</div>
            </div>
            <div className="admin-stat-value">356</div>
            <div className="admin-stat-label">Total Users</div>
            <div className="admin-stat-trend trend-up">↑ 8%</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon" style={{background: '#ffebee', color: '#d32f2f'}}>⚠️</div>
            </div>
            <div className="admin-stat-value">5</div>
            <div className="admin-stat-label">Open Disputes</div>
            <div className="admin-stat-trend trend-down">↓ 4%</div>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '30px'}}>
          <div className="admin-section" style={{flex: 2, margin: 0}}>
            <div className="admin-section-header">
              <h2>Revenue Trend</h2>
              <select className="ad-btn" style={{padding: '4px 10px', fontSize: '12px'}}><option>Daily ▾</option></select>
            </div>
            <div className="ad-chart-placeholder" style={{background: 'linear-gradient(to top, rgba(75, 42, 181, 0.05), transparent)'}}>
              <div style={{width: '100%', padding: '0 20px', position: 'relative'}}>
                {/* Simulated Chart Line */}
                <svg width="100%" height="150" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <path d="M 0,100 L 50,120 L 100,80 L 150,110 L 200,60 L 250,90 L 300,40 L 350,70 L 400,20 L 450,50 L 500,10" fill="none" stroke="#4b2ab5" strokeWidth="3" />
                  <circle cx="500" cy="10" r="5" fill="#4b2ab5" />
                </svg>
                {/* Chart labels */}
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888', marginTop: '10px'}}>
                  <span>Sep 1</span><span>Sep 5</span><span>Sep 10</span><span>Sep 15</span><span>Sep 20</span><span>Sep 25</span><span>Sep 30</span>
                </div>
                <div style={{position: 'absolute', left: 0, top: 0, bottom: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: '#888'}}>
                  <span>₹ 5L</span><span>₹ 4L</span><span>₹ 3L</span><span>₹ 2L</span><span>₹ 1L</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="admin-section" style={{flex: 1, margin: 0}}>
            <div className="admin-section-header">
              <h2>Category Distribution</h2>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '20px', height: '200px'}}>
              <div className="ad-circle-chart" style={{borderTopColor: '#4b2ab5', borderRightColor: '#e91e63', borderBottomColor: '#ff9800', borderLeftColor: '#03a9f4'}}>
                <span style={{fontSize: '24px', fontWeight: 'bold', color: '#1a1025'}}>124</span>
                <span style={{fontSize: '11px', color: '#666'}}>Auctions</span>
              </div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px'}}><span style={{color: '#4b2ab5'}}>● Jewelry</span> <span>28%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px'}}><span style={{color: '#e91e63'}}>● Art & Collectibles</span> <span>22%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px'}}><span style={{color: '#ff9800'}}>● Home & Decor</span> <span>18%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px'}}><span style={{color: '#03a9f4'}}>● Fashion</span> <span>14%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}><span style={{color: '#333'}}>● Vehicles</span> <span>10%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '8px'}}><span style={{color: '#999'}}>● Others</span> <span>8%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
