
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './SellerDashboard.css';

export default function Disputes() {
  return (
    <DashboardLayout role="seller">
      <div className="seller-page">
        <div className="seller-header-row">
          <div>
            <h1>Disputes</h1>
            <p>Resolve issues and communicate with our support team.</p>
          </div>
          <button className="s-btn s-btn-primary">Raise a Dispute</button>
        </div>
        
        <div className="seller-section" style={{padding: 0}}>
          <div className="s-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="s-tab active">Open (1)</div>
            <div className="s-tab">In Progress (2)</div>
            <div className="s-tab">Resolved (2)</div>
          </div>

          <table className="seller-table">
            <thead>
              <tr>
                <th>Dispute ID</th>
                <th>Item</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Last Update</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: 600}}>#DSP001</td>
                <td><div className="s-item-cell"><img src="/auctions/fashion/fashion-01.png" className="s-item-img"/><span style={{fontWeight: 600}}>Designer Handbag</span></div></td>
                <td>Item not as described</td>
                <td><span className="seller-badge badge-in-progress">In Progress</span></td>
                <td>Sep 20, 2025</td>
                <td><button className="s-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#DSP002</td>
                <td><div className="s-item-cell"><img src="/auctions/home/home-01.png" className="s-item-img"/><span style={{fontWeight: 600}}>Vintage Vase</span></div></td>
                <td>Late delivery</td>
                <td><span className="seller-badge badge-open">Open</span></td>
                <td>Sep 18, 2025</td>
                <td><button className="s-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#DSP003</td>
                <td><div className="s-item-cell"><img src="/auctions/art/art-01.png" className="s-item-img"/><span style={{fontWeight: 600}}>Antique Painting</span></div></td>
                <td>Refund request</td>
                <td><span className="seller-badge badge-resolved">Resolved</span></td>
                <td>Sep 12, 2025</td>
                <td><button className="s-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
