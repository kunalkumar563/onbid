
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AdminDashboard.css';

export default function Transactions() {
  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        <div className="admin-header-row">
          <div>
            <h1>Transactions</h1>
            <p>View all payments, refunds and platform transactions.</p>
          </div>
        </div>
        
        <div className="admin-section" style={{padding: 0}}>
          <div className="ad-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="ad-tab active">All (345)</div>
            <div className="ad-tab">Payments (184)</div>
            <div className="ad-tab">Refunds (24)</div>
            <div className="ad-tab">Payouts (37)</div>
            <div style={{marginLeft: 'auto'}}>
              <select className="ad-btn"><option>Sep 1, 2025 - Sep 30, 2025 ▾</option></select>
            </div>
          </div>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Reference</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sep 24, 2025</td>
                <td>Payment</td>
                <td>TRX001</td>
                <td>Rahul S.</td>
                <td style={{fontWeight: 600}}>₹ 1,25,000</td>
                <td><span className="ad-badge badge-completed">Completed</span></td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td>Sep 23, 2025</td>
                <td>Payout</td>
                <td>POUT001</td>
                <td>Priya M.</td>
                <td style={{fontWeight: 600}}>₹ 85,000</td>
                <td><span className="ad-badge badge-completed">Completed</span></td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td>Sep 22, 2025</td>
                <td>Payment</td>
                <td>TRX002</td>
                <td>Amit K.</td>
                <td style={{fontWeight: 600}}>₹ 62,000</td>
                <td><span className="ad-badge badge-completed">Completed</span></td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td>Sep 21, 2025</td>
                <td>Refund</td>
                <td>REF001</td>
                <td>Neha K.</td>
                <td style={{fontWeight: 600}}>₹ 18,750</td>
                <td><span className="ad-badge badge-processed">Processed</span></td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td>Sep 20, 2025</td>
                <td>Payment</td>
                <td>TRX003</td>
                <td>Sneha R.</td>
                <td style={{fontWeight: 600}}>₹ 3,10,000</td>
                <td><span className="ad-badge badge-completed">Completed</span></td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
