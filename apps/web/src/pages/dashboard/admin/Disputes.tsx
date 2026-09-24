
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AdminDashboard.css';

export default function Disputes() {
  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        <div className="admin-header-row">
          <div>
            <h1>Disputes</h1>
            <p>Handle buyer-seller disputes and resolution process.</p>
          </div>
        </div>
        
        <div className="admin-section" style={{padding: 0}}>
          <div className="ad-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="ad-tab active">Open (5)</div>
            <div className="ad-tab">In Progress (3)</div>
            <div className="ad-tab">Resolved (12)</div>
            <div className="ad-tab">Closed (8)</div>
          </div>
          
          <div style={{padding: '15px 20px', borderBottom: '1px solid #f0ebf5', display: 'flex', gap: '15px'}}>
            <input type="text" className="ad-btn" placeholder="🔍 Search disputes..." style={{flex: 1, cursor: 'text'}} />
            <select className="ad-btn"><option>All Status ▾</option></select>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Raised By</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: 600}}>#DSP001</td>
                <td><div className="ad-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Vintage Watch</span></div></td>
                <td>Rahul S.</td>
                <td>Item not as described</td>
                <td>Sep 24, 2025</td>
                <td><span className="ad-badge badge-open">Open</span></td>
                <td><button className="ad-btn-link">Review</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#DSP002</td>
                <td><div className="ad-item-cell"><img src="/auctions/art/art-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Art Painting</span></div></td>
                <td>Priya M.</td>
                <td>Damaged item</td>
                <td>Sep 23, 2025</td>
                <td><span className="ad-badge badge-in-progress">In Progress</span></td>
                <td><button className="ad-btn-link">Review</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#DSP003</td>
                <td><div className="ad-item-cell"><img src="/auctions/fashion/fashion-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Handbag</span></div></td>
                <td>Neha K.</td>
                <td>Refund request</td>
                <td>Sep 22, 2025</td>
                <td><span className="ad-badge badge-open">Open</span></td>
                <td><button className="ad-btn-link">Review</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#DSP004</td>
                <td><div className="ad-item-cell"><img src="/auctions/vehicles/vehicles-01.png" className="ad-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Car Model</span></div></td>
                <td>Sneha R.</td>
                <td>Late delivery</td>
                <td>Sep 18, 2025</td>
                <td><span className="ad-badge badge-resolved">Resolved</span></td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
