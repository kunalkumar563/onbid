
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function Auctions() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>All Auctions</h1>
            <p>Manage, edit and monitor all your auctions.</p>
          </div>
          <Link to="/dashboard/auctioneer/auctions/create" className="a-btn a-btn-primary" style={{textDecoration: 'none'}}>+ Create Auction</Link>
        </div>
        
        <div className="auct-section" style={{padding: 0}}>
          <div className="a-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="a-tab active">All (24)</div>
            <div className="a-tab">Live (6)</div>
            <div className="a-tab">Scheduled (8)</div>
            <div className="a-tab">Ended (10)</div>
          </div>
          
          <div style={{padding: '15px 20px', borderBottom: '1px solid #f0ebf5', display: 'flex', gap: '15px'}}>
            <input type="text" className="a-btn" placeholder="🔍 Search auctions..." style={{flex: 1, cursor: 'text'}} />
            <select className="a-btn"><option>Category ▾</option></select>
            <select className="a-btn"><option>Status ▾</option></select>
            <select className="a-btn"><option>Sort ▾</option></select>
          </div>

          <table className="auct-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Bids</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/home/home-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Vintage Chandelier</span></div></td>
                <td>Home & Decor</td>
                <td>Sep 22, 2025</td>
                <td>Sep 25, 2025</td>
                <td><span className="a-badge badge-live">Live</span></td>
                <td>12</td>
                <td><button className="a-btn-link" style={{fontSize: '20px', color: '#666'}}>⋮</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Rolex Datejust</span></div></td>
                <td>Jewelry</td>
                <td>Sep 21, 2025</td>
                <td>Sep 24, 2025</td>
                <td><span className="a-badge badge-live">Live</span></td>
                <td>32</td>
                <td><button className="a-btn-link" style={{fontSize: '20px', color: '#666'}}>⋮</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/art/art-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Modern Art Painting</span></div></td>
                <td>Art & Collectibles</td>
                <td>Sep 26, 2025</td>
                <td>Sep 29, 2025</td>
                <td><span className="a-badge badge-scheduled">Scheduled</span></td>
                <td>0</td>
                <td><button className="a-btn-link" style={{fontSize: '20px', color: '#666'}}>⋮</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/home/home-01.png" className="a-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Antique Vase</span></div></td>
                <td>Art & Collectibles</td>
                <td>Sep 10, 2025</td>
                <td>Sep 12, 2025</td>
                <td><span className="a-badge badge-ended">Ended</span></td>
                <td>28</td>
                <td><button className="a-btn-link" style={{fontSize: '20px', color: '#666'}}>⋮</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/fashion/fashion-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Designer Handbag</span></div></td>
                <td>Fashion</td>
                <td>Sep 18, 2025</td>
                <td>Sep 20, 2025</td>
                <td><span className="a-badge badge-ended">Ended</span></td>
                <td>15</td>
                <td><button className="a-btn-link" style={{fontSize: '20px', color: '#666'}}>⋮</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
