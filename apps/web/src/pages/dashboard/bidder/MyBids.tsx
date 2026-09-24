
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function MyBids() {
  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>My Bids</h1>
            <p>Track your active bids and bidding history.</p>
          </div>
        </div>
        
        <div className="bidder-section" style={{padding: 0}}>
          <div className="b-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="b-tab active">Active Bids (4)</div>
            <div className="b-tab">Outbid (2)</div>
            <div className="b-tab">Won (3)</div>
            <div className="b-tab">Lost (5)</div>
          </div>

          <table className="bidder-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>My Bid</th>
                <th>Current Bid</th>
                <th>Time Left</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="b-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="b-item-img"/><span style={{fontWeight: 600}}>Rolex Datejust Watch</span></div></td>
                <td>₹ 4,20,000</td>
                <td>₹ 4,50,000</td>
                <td><span style={{color: '#d32f2f', fontWeight: 600}}>2h 14m</span></td>
                <td><span className="b-badge badge-outbid">Outbid</span></td>
                <td><button className="b-btn b-btn-primary" style={{padding: '6px 12px', fontSize: '12px'}}>Bid Again</button></td>
              </tr>
              <tr>
                <td><div className="b-item-cell"><img src="/auctions/home/home-01.png" className="b-item-img"/><span style={{fontWeight: 600}}>Vintage Crystal Chandelier</span></div></td>
                <td>₹ 1,20,000</td>
                <td>₹ 1,25,000</td>
                <td>4h 32m</td>
                <td><span className="b-badge badge-highest">Highest Bid</span></td>
                <td><button className="b-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="b-item-cell"><img src="/auctions/art/art-01.png" className="b-item-img"/><span style={{fontWeight: 600}}>Modern Art Painting</span></div></td>
                <td>₹ 80,000</td>
                <td>₹ 85,000</td>
                <td>1d 6h</td>
                <td><span className="b-badge badge-active">Active</span></td>
                <td><button className="b-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="b-item-cell"><img src="/auctions/home/home-01.png" className="b-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Antique Vase</span></div></td>
                <td>₹ 60,000</td>
                <td>₹ 62,000</td>
                <td>3d 12h</td>
                <td><span className="b-badge badge-active">Active</span></td>
                <td><button className="b-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
