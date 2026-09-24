
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function Disputes() {
  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>Disputes</h1>
            <p>Raise and manage disputes with our support team.</p>
          </div>
        </div>
        
        <div className="bidder-section" style={{padding: 0}}>
          <div className="b-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="b-tab active">Open (1)</div>
            <div className="b-tab">In Progress (2)</div>
            <div className="b-tab">Resolved (2)</div>
            <div className="b-tab">Closed (0)</div>
          </div>
          
          <table className="bidder-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Order ID</th>
                <th>Item</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Last Update</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: 600}}>#DSP001</td>
                <td>#ORD002</td>
                <td><span style={{fontWeight: 600}}>Art & Collectibles</span></td>
                <td>Item not as described</td>
                <td><span className="b-badge badge-open">Open</span></td>
                <td>Sep 18, 2025</td>
                <td><button className="b-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#DSP002</td>
                <td>#ORD003</td>
                <td><span style={{fontWeight: 600}}>Antique Vase</span></td>
                <td>Damaged item</td>
                <td><span className="b-badge badge-in-progress">In Progress</span></td>
                <td>Sep 15, 2025</td>
                <td><button className="b-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#DSP003</td>
                <td>#ORD005</td>
                <td><span style={{fontWeight: 600}}>LV Handbag</span></td>
                <td>Missing certificate</td>
                <td><span className="b-badge badge-resolved">Resolved</span></td>
                <td>Sep 10, 2025</td>
                <td><button className="b-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
