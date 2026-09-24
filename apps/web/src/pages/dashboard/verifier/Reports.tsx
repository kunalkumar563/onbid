
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './VerifierDashboard.css';

export default function Reports() {
  return (
    <DashboardLayout role="verifier">
      <div className="verifier-page">
        <div className="verifier-header-row">
          <div>
            <h1>Reports & Analytics</h1>
            <p>Track your verification performance and insights.</p>
          </div>
          <div style={{background: 'white', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px', fontWeight: 600}}>
            📅 Sep 1, 2025 - Sep 30, 2025
          </div>
        </div>
        
        <div className="verifier-stats-row">
          <div className="verifier-stat-card">
            <div className="verifier-stat-header">
              <div className="verifier-stat-icon" style={{background: '#e8f5e9', color: '#2e7d32'}}>✅</div>
            </div>
            <div className="verifier-stat-value">52</div>
            <div className="verifier-stat-label">Total Verified</div>
          </div>
          <div className="verifier-stat-card">
            <div className="verifier-stat-header">
              <div className="verifier-stat-icon" style={{background: '#ffebee', color: '#d32f2f'}}>❌</div>
            </div>
            <div className="verifier-stat-value">6</div>
            <div className="verifier-stat-label">Rejected</div>
          </div>
          <div className="verifier-stat-card">
            <div className="verifier-stat-header">
              <div className="verifier-stat-icon" style={{background: '#fff8e1', color: '#ffb300'}}>🚩</div>
            </div>
            <div className="verifier-stat-value">2</div>
            <div className="verifier-stat-label">Flagged</div>
          </div>
          <div className="verifier-stat-card">
            <div className="verifier-stat-header">
              <div className="verifier-stat-icon" style={{background: '#f3e5f5', color: '#ab47bc'}}>⏱️</div>
            </div>
            <div className="verifier-stat-value">1.2</div>
            <div className="verifier-stat-label">Avg. Review Time (hrs)</div>
          </div>
        </div>

        <div style={{display: 'flex', gap: '30px'}}>
          <div className="verifier-section" style={{flex: 2}}>
            <h3 style={{marginTop: 0, marginBottom: '20px'}}>Verification Trends</h3>
            <div style={{height: '250px', display: 'flex', alignItems: 'flex-end', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee', position: 'relative'}}>
              {/* Mock Chart */}
              <svg width="100%" height="200" style={{position: 'absolute', bottom: '20px', left: 0}}>
                <path d="M 0 180 L 100 150 L 200 160 L 300 80 L 400 120 L 500 50 L 600 90 L 700 40 L 800 60" fill="none" stroke="#4b2ab5" strokeWidth="3" />
                <path d="M 0 180 L 100 150 L 200 160 L 300 80 L 400 120 L 500 50 L 600 90 L 700 40 L 800 60 L 800 200 L 0 200 Z" fill="rgba(75, 42, 181, 0.1)" stroke="none" />
                <circle cx="100" cy="150" r="5" fill="#4b2ab5" />
                <circle cx="200" cy="160" r="5" fill="#4b2ab5" />
                <circle cx="300" cy="80" r="5" fill="#4b2ab5" />
                <circle cx="400" cy="120" r="5" fill="#4b2ab5" />
                <circle cx="500" cy="50" r="5" fill="#4b2ab5" />
                <circle cx="600" cy="90" r="5" fill="#4b2ab5" />
                <circle cx="700" cy="40" r="5" fill="#4b2ab5" />
              </svg>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#888', fontSize: '12px'}}>
              <span>Sep 1</span>
              <span>Sep 5</span>
              <span>Sep 10</span>
              <span>Sep 15</span>
              <span>Sep 20</span>
              <span>Sep 25</span>
              <span>Sep 30</span>
            </div>
          </div>
          
          <div className="verifier-section" style={{flex: 1}}>
            <h3 style={{marginTop: 0, marginBottom: '20px'}}>Category Distribution</h3>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px'}}>
              <div style={{width: '150px', height: '150px', borderRadius: '50%', background: 'conic-gradient(#4b2ab5 0% 28%, #1976d2 28% 50%, #ffb300 50% 68%, #d32f2f 68% 84%, #4caf50 84% 96%, #9e9e9e 96% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '100px', height: '100px', background: 'white', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '24px', fontWeight: 'bold'}}>52</span>
                  <span style={{fontSize: '12px', color: '#666'}}>Items</span>
                </div>
              </div>
              <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}><span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#4b2ab5'}}></span> Watches</span> <span>28%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}><span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#1976d2'}}></span> Art & Collectibles</span> <span>22%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}><span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#ffb300'}}></span> Home & Decor</span> <span>18%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}><span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#d32f2f'}}></span> Fashion</span> <span>16%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}><span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50'}}></span> Jewelry</span> <span>12%</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}><span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#9e9e9e'}}></span> Others</span> <span>4%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
