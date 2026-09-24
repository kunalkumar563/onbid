
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function Payouts() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Payouts & Wallet</h1>
            <p>Track your earnings and manage withdrawals.</p>
          </div>
        </div>
        
        <div className="auct-stats-row" style={{gridTemplateColumns: 'repeat(3, 1fr) auto'}}>
          <div className="auct-stat-card">
            <div className="auct-stat-header">
              <div className="auct-stat-icon" style={{background: '#e8f5e9', color: '#2e7d32'}}>₹</div>
            </div>
            <div className="auct-stat-value">₹ 2,45,000</div>
            <div className="auct-stat-label">Total Earnings</div>
          </div>
          <div className="auct-stat-card">
            <div className="auct-stat-header">
              <div className="auct-stat-icon" style={{background: '#e3f2fd', color: '#1976d2'}}>₹</div>
            </div>
            <div className="auct-stat-value">₹ 1,80,000</div>
            <div className="auct-stat-label">Available Balance</div>
          </div>
          <div className="auct-stat-card">
            <div className="auct-stat-header">
              <div className="auct-stat-icon" style={{background: '#ffebee', color: '#d32f2f'}}>₹</div>
            </div>
            <div className="auct-stat-value">₹ 50,000</div>
            <div className="auct-stat-label">Pending Clearance</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <button className="a-btn a-btn-primary" style={{padding: '12px 25px', fontSize: '15px'}}>+ Withdraw Funds</button>
          </div>
        </div>

        <div className="auct-section" style={{padding: 0}}>
          <div className="a-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="a-tab active">Transaction History</div>
            <div className="a-tab">Withdrawal Requests</div>
          </div>
          
          <table className="auct-table">
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
                <td>Sep 10, 2025</td>
                <td>Auction Sale</td>
                <td>ORD001</td>
                <td style={{fontWeight: 600, color: '#2e7d32'}}>+ ₹ 1,25,000</td>
                <td><span className="a-badge badge-sold">Completed</span></td>
              </tr>
              <tr>
                <td>Sep 08, 2025</td>
                <td>Auction Sale</td>
                <td>ORD002</td>
                <td style={{fontWeight: 600, color: '#2e7d32'}}>+ ₹ 2,10,000</td>
                <td><span className="a-badge badge-sold">Completed</span></td>
              </tr>
              <tr>
                <td>Sep 05, 2025</td>
                <td>Withdrawal</td>
                <td>WDR001</td>
                <td style={{fontWeight: 600, color: '#d32f2f'}}>- ₹ 50,000</td>
                <td><span className="a-badge badge-sold">Completed</span></td>
              </tr>
              <tr>
                <td>Aug 25, 2025</td>
                <td>Auction Sale</td>
                <td>ORD003</td>
                <td style={{fontWeight: 600, color: '#2e7d32'}}>+ ₹ 1,10,000</td>
                <td><span className="a-badge badge-sold">Completed</span></td>
              </tr>
              <tr>
                <td>Aug 20, 2025</td>
                <td>Withdrawal</td>
                <td>WDR002</td>
                <td style={{fontWeight: 600, color: '#d32f2f'}}>- ₹ 75,000</td>
                <td><span className="a-badge badge-sold">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
