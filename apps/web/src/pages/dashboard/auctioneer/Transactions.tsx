
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function Transactions() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Transactions</h1>
            <p>Track payments, fees, and financial activity.</p>
          </div>
        </div>
        
        <div className="auct-section" style={{padding: 0}}>
          <div className="a-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="a-tab active">All</div>
            <div className="a-tab">Payments</div>
            <div className="a-tab">Refunds</div>
            <div className="a-tab">Platform Fees</div>
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
                <td>Sep 12, 2025</td>
                <td>Payment</td>
                <td>ORD001</td>
                <td style={{color: '#2e7d32', fontWeight: 600}}>+ ₹ 4,20,000</td>
                <td><span className="a-badge badge-sold">Completed</span></td>
              </tr>
              <tr>
                <td>Sep 12, 2025</td>
                <td>Platform Fee</td>
                <td>FEE001</td>
                <td style={{color: '#d32f2f', fontWeight: 600}}>- ₹ 21,000</td>
                <td><span className="a-badge badge-sold">Completed</span></td>
              </tr>
              <tr>
                <td>Aug 28, 2025</td>
                <td>Payment</td>
                <td>ORD002</td>
                <td style={{color: '#2e7d32', fontWeight: 600}}>+ ₹ 60,000</td>
                <td><span className="a-badge badge-sold">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
