
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function Payouts() {
  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>Payouts & Wallet</h1>
            <p>Track your earnings, refunds and withdrawals.</p>
          </div>
        </div>
        
        <div className="bidder-stats-row" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
          <div className="bidder-stat-card">
            <div className="bidder-stat-header">
              <div className="bidder-stat-icon" style={{background: '#ffebee', color: '#d32f2f'}}>₹</div>
            </div>
            <div className="bidder-stat-value">₹ 2,45,000</div>
            <div className="bidder-stat-label">Total Spent</div>
          </div>
          <div className="bidder-stat-card">
            <div className="bidder-stat-header">
              <div className="bidder-stat-icon" style={{background: '#e8f5e9', color: '#2e7d32'}}>₹</div>
            </div>
            <div className="bidder-stat-value">₹ 18,75,000</div>
            <div className="bidder-stat-label">Total Refunded</div>
          </div>
          <div className="bidder-stat-card" style={{position: 'relative'}}>
            <div className="bidder-stat-header">
              <div className="bidder-stat-icon" style={{background: '#e3f2fd', color: '#1976d2'}}>₹</div>
            </div>
            <div className="bidder-stat-value">₹ 0</div>
            <div className="bidder-stat-label">Available Balance</div>
            <button className="b-btn b-btn-primary" style={{position: 'absolute', top: '20px', right: '20px'}}>Withdraw</button>
          </div>
        </div>

        <div className="bidder-section" style={{padding: 0}}>
          <div className="b-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="b-tab active">Transaction History</div>
            <div className="b-tab">Withdrawal Requests</div>
          </div>
          
          <table className="bidder-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sep 12, 2025</td>
                <td>Payment</td>
                <td>ORD001</td>
                <td style={{fontWeight: 600, color: '#d32f2f'}}>- ₹ 1,25,000</td>
                <td><span className="b-badge badge-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Aug 28, 2025</td>
                <td>Payment</td>
                <td>ORD002</td>
                <td style={{fontWeight: 600, color: '#d32f2f'}}>- ₹ 85,000</td>
                <td><span className="b-badge badge-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Jul 16, 2025</td>
                <td>Payment</td>
                <td>ORD003</td>
                <td style={{fontWeight: 600, color: '#d32f2f'}}>- ₹ 62,000</td>
                <td><span className="b-badge badge-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Jun 10, 2025</td>
                <td>Refund</td>
                <td>REF004</td>
                <td style={{fontWeight: 600, color: '#2e7d32'}}>+ ₹ 18,75,000</td>
                <td><span className="b-badge badge-completed">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
