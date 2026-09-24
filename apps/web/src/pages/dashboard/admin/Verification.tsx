
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AdminDashboard.css';

export default function Verification() {
  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        <div className="admin-header-row">
          <div>
            <h1>Verification Queue</h1>
            <p>Review and verify items submitted by sellers.</p>
          </div>
        </div>
        
        <div className="admin-section" style={{padding: 0}}>
          <div className="ad-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="ad-tab active">Pending (8)</div>
            <div className="ad-tab">In Review (4)</div>
            <div className="ad-tab">Approved (26)</div>
            <div className="ad-tab">Rejected (6)</div>
          </div>
          
          <div style={{padding: '15px 20px', borderBottom: '1px solid #f0ebf5', display: 'flex', gap: '15px'}}>
            <input type="text" className="ad-btn" placeholder="🔍 Search items..." style={{flex: 1, cursor: 'text'}} />
            <select className="ad-btn"><option>All Categories ▾</option></select>
            <select className="ad-btn"><option>All Priorities ▾</option></select>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Submitted By</th>
                <th>Date</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="ad-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Vintage Watch</span></div></td>
                <td>Jewelry</td>
                <td>Rahul S.</td>
                <td>Sep 24, 2025</td>
                <td><span className="ad-badge badge-high">High</span></td>
                <td><button className="ad-btn-link">Review</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><img src="/auctions/art/art-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Art Painting</span></div></td>
                <td>Art & Collectibles</td>
                <td>Priya M.</td>
                <td>Sep 23, 2025</td>
                <td><span className="ad-badge badge-high">High</span></td>
                <td><button className="ad-btn-link">Review</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><img src="/auctions/fashion/fashion-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Designer Bag</span></div></td>
                <td>Fashion</td>
                <td>Amit K.</td>
                <td>Sep 22, 2025</td>
                <td><span className="ad-badge badge-medium">Medium</span></td>
                <td><button className="ad-btn-link">Review</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><img src="/auctions/home/home-01.png" className="ad-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Antique Vase</span></div></td>
                <td>Home & Decor</td>
                <td>Neha K.</td>
                <td>Sep 21, 2025</td>
                <td><span className="ad-badge badge-medium">Medium</span></td>
                <td><button className="ad-btn-link">Review</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Diamond Necklace</span></div></td>
                <td>Jewelry</td>
                <td>Sneha R.</td>
                <td>Sep 20, 2025</td>
                <td><span className="ad-badge badge-low">Low</span></td>
                <td><button className="ad-btn-link">Review</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
