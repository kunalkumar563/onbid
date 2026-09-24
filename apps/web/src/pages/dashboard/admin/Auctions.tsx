
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AdminDashboard.css';

export default function Auctions() {
  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        <div className="admin-header-row">
          <div>
            <h1>Manage Auctions</h1>
            <p>View, edit and manage all auctions on the platform.</p>
          </div>
          <button className="ad-btn ad-btn-primary">+ Create Auction</button>
        </div>
        
        <div className="admin-section" style={{padding: 0}}>
          <div className="ad-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="ad-tab active">All (124)</div>
            <div className="ad-tab">Live (28)</div>
            <div className="ad-tab">Scheduled (42)</div>
            <div className="ad-tab">Ended (54)</div>
            <div className="ad-tab">Drafts (10)</div>
          </div>
          
          <div style={{padding: '15px 20px', borderBottom: '1px solid #f0ebf5', display: 'flex', gap: '15px'}}>
            <input type="text" className="ad-btn" placeholder="🔍 Search auctions..." style={{flex: 1, cursor: 'text'}} />
            <select className="ad-btn"><option>All Categories ▾</option></select>
            <select className="ad-btn"><option>All Status ▾</option></select>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Seller</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Bids</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="ad-item-cell"><img src="/auctions/home/home-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Vintage Crystal Chandelier</span></div></td>
                <td>Home & Decor</td>
                <td>Rahul S.</td>
                <td>Sep 25, 2025</td>
                <td>Sep 28, 2025</td>
                <td><span className="ad-badge badge-live">Live</span></td>
                <td>24</td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Rolex Datejust Watch</span></div></td>
                <td>Jewelry</td>
                <td>Priya M.</td>
                <td>Sep 24, 2025</td>
                <td>Sep 27, 2025</td>
                <td><span className="ad-badge badge-live">Live</span></td>
                <td>32</td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><img src="/auctions/art/art-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Modern Art Painting</span></div></td>
                <td>Art & Collectibles</td>
                <td>Amit K.</td>
                <td>Sep 28, 2025</td>
                <td>Oct 02, 2025</td>
                <td><span className="ad-badge badge-scheduled">Scheduled</span></td>
                <td>0</td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><img src="/auctions/home/home-01.png" className="ad-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Antique Vase</span></div></td>
                <td>Home & Decor</td>
                <td>Neha K.</td>
                <td>Sep 17, 2025</td>
                <td>Sep 20, 2025</td>
                <td><span className="ad-badge badge-ended">Ended</span></td>
                <td>18</td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><img src="/auctions/fashion/fashion-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Designer Handbag</span></div></td>
                <td>Fashion</td>
                <td>Sneha R.</td>
                <td>Sep 16, 2025</td>
                <td>Sep 19, 2025</td>
                <td><span className="ad-badge badge-ended">Ended</span></td>
                <td>12</td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><img src="/auctions/vehicles/vehicles-01.png" className="ad-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Classic Car Model</span></div></td>
                <td>Vehicles</td>
                <td>Karan T.</td>
                <td>Sep 15, 2025</td>
                <td>Sep 18, 2025</td>
                <td><span className="ad-badge badge-ended">Ended</span></td>
                <td>28</td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
