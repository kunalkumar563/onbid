
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './SellerDashboard.css';

export default function Payouts() {
  return (
    <DashboardLayout role="seller">
      <div className="seller-page">
        <div className="seller-header-row">
          <div>
            <h1>Payouts</h1>
            <p>Track your earnings and withdrawal history.</p>
          </div>
          <button className="s-btn s-btn-primary">Withdraw Funds</button>
        </div>
        
        <div className="seller-stats-row" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
          <div className="seller-stat-card">
            <div className="seller-stat-header">
              <div className="seller-stat-icon" style={{background: '#f3e5f5', color: '#ab47bc'}}>₹</div>
            </div>
            <div className="seller-stat-value">2,45,000</div>
            <div className="seller-stat-label">Total Earnings</div>
          </div>
          <div className="seller-stat-card">
            <div className="seller-stat-header">
              <div className="seller-stat-icon" style={{background: '#e3f2fd', color: '#1976d2'}}>₹</div>
            </div>
            <div className="seller-stat-value">1,80,000</div>
            <div className="seller-stat-label">Available Balance</div>
          </div>
          <div className="seller-stat-card">
            <div className="seller-stat-header">
              <div className="seller-stat-icon" style={{background: '#e8f5e9', color: '#2e7d32'}}>₹</div>
            </div>
            <div className="seller-stat-value">65,000</div>
            <div className="seller-stat-label">Withdrawn</div>
          </div>
        </div>

        <div className="seller-section" style={{padding: 0}}>
          <div className="seller-section-header" style={{padding: '25px 25px 0'}}>
            <h2>Transaction History</h2>
          </div>
          <table className="seller-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sep 18, 2025</td>
                <td>Auction Sale</td>
                <td style={{fontWeight: 600, color: '#2e7d32'}}>+ ₹ 1,25,000</td>
                <td><span className="seller-badge badge-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Sep 10, 2025</td>
                <td>Auction Sale</td>
                <td style={{fontWeight: 600, color: '#2e7d32'}}>+ ₹ 75,000</td>
                <td><span className="seller-badge badge-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Sep 05, 2025</td>
                <td>Withdrawal</td>
                <td style={{fontWeight: 600, color: '#d32f2f'}}>- ₹ 50,000</td>
                <td><span className="seller-badge badge-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Aug 28, 2025</td>
                <td>Auction Sale</td>
                <td style={{fontWeight: 600, color: '#2e7d32'}}>+ ₹ 90,000</td>
                <td><span className="seller-badge badge-completed">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
