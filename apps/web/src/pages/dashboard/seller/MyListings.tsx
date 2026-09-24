
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './SellerDashboard.css';

export default function MyListings() {
  return (
    <DashboardLayout role="seller">
      <div className="seller-page">
        <div className="seller-header-row">
          <div>
            <h1>My Listings</h1>
            <p>Manage all your listed items in one place.</p>
          </div>
          <Link to="/listings/create" className="s-btn s-btn-primary" style={{textDecoration: 'none'}}>Create New Listing</Link>
        </div>

        <div className="seller-section" style={{padding: 0}}>
          <div className="s-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="s-tab active">All (12)</div>
            <div className="s-tab">Active (8)</div>
            <div className="s-tab">Under Review (3)</div>
            <div className="s-tab">Drafts (1)</div>
            <div className="s-tab">Ended (0)</div>
          </div>
          
          <div style={{padding: '20px', display: 'flex', gap: '15px'}}>
            <input type="text" placeholder="Search auctions, orders..." className="s-btn" style={{width: '300px', cursor: 'text', textAlign: 'left'}} />
            <select className="s-btn" style={{marginLeft: 'auto'}}><option>Filter</option></select>
            <select className="s-btn"><option>Sort by</option></select>
          </div>

          <table className="seller-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Status</th>
                <th>Bids</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="s-item-cell">
                    <img src="/auctions/home/home-01.png" className="s-item-img"/>
                    <span style={{fontWeight: 600}}>Vintage Crystal Chandelier</span>
                  </div>
                </td>
                <td>Home & Garden</td>
                <td><span className="seller-badge badge-active">Active</span></td>
                <td>12</td>
                <td>245</td>
                <td><button className="s-btn-link">View ▾</button></td>
              </tr>
              <tr>
                <td>
                  <div className="s-item-cell">
                    <img src="/auctions/jewelry/jewelry-01.png" className="s-item-img"/>
                    <span style={{fontWeight: 600}}>Rolex Datejust Watch</span>
                  </div>
                </td>
                <td>Jewelry & Watches</td>
                <td><span className="seller-badge badge-under-review">Under Review</span></td>
                <td>-</td>
                <td>189</td>
                <td><button className="s-btn-link">View ▾</button></td>
              </tr>
              <tr>
                <td>
                  <div className="s-item-cell">
                    <img src="/auctions/art/art-01.png" className="s-item-img"/>
                    <span style={{fontWeight: 600}}>Modern Art Painting</span>
                  </div>
                </td>
                <td>Art & Collectibles</td>
                <td><span className="seller-badge badge-ended">Ended</span></td>
                <td>28</td>
                <td>320</td>
                <td><button className="s-btn-link">View ▾</button></td>
              </tr>
              <tr>
                <td>
                  <div className="s-item-cell">
                    <img src="/auctions/fashion/fashion-01.png" className="s-item-img"/>
                    <span style={{fontWeight: 600}}>Louis Vuitton Handbag</span>
                  </div>
                </td>
                <td>Fashion</td>
                <td><span className="seller-badge badge-active">Active</span></td>
                <td>6</td>
                <td>178</td>
                <td><button className="s-btn-link">View ▾</button></td>
              </tr>
              <tr>
                <td>
                  <div className="s-item-cell">
                    <img src="/auctions/home/home-01.png" className="s-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/>
                    <span style={{fontWeight: 600}}>Antique Vase</span>
                  </div>
                </td>
                <td>Art & Collectibles</td>
                <td><span className="seller-badge badge-draft">Draft</span></td>
                <td>-</td>
                <td>0</td>
                <td><button className="s-btn-link">Edit ▾</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
