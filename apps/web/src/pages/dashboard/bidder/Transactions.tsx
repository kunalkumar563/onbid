
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function Transactions() {
  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>Transactions</h1>
            <p>View your payment history and transaction details.</p>
          </div>
        </div>
        
        <div className="bidder-section" style={{padding: 0}}>
          <div className="b-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="b-tab active">All (10)</div>
            <div className="b-tab">Payments (5)</div>
            <div className="b-tab">Refunds (1)</div>
            <div className="b-tab">Payouts (4)</div>
          </div>
          
          <table className="bidder-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sep 12, 2025</td>
                <td>Payment</td>
                <td>Vintage Watch (Order #001)</td>
                <td style={{color: '#d32f2f', fontWeight: 600}}>- ₹ 2,40,000</td>
                <td><span className="b-badge badge-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Aug 28, 2025</td>
                <td>Payment</td>
                <td>Antique Painting (Order #002)</td>
                <td style={{color: '#d32f2f', fontWeight: 600}}>- ₹ 1,25,000</td>
                <td><span className="b-badge badge-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Jul 16, 2025</td>
                <td>Payment</td>
                <td>Antique Vase (Order #003)</td>
                <td style={{color: '#d32f2f', fontWeight: 600}}>- ₹ 62,000</td>
                <td><span className="b-badge badge-completed">Completed</span></td>
              </tr>
              <tr>
                <td>Jun 10, 2025</td>
                <td>Refund</td>
                <td>Diamond Necklace (Order #004)</td>
                <td style={{color: '#2e7d32', fontWeight: 600}}>+ ₹ 10,75,000</td>
                <td><span className="b-badge badge-completed">Completed</span></td>
              </tr>
              <tr>
                <td>May 22, 2025</td>
                <td>Payment</td>
                <td>Louis Vuitton Bag (Order #005)</td>
                <td style={{color: '#d32f2f', fontWeight: 600}}>- ₹ 3,10,000</td>
                <td><span className="b-badge badge-completed">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
