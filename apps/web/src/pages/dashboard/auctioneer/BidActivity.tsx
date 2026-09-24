
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function BidActivity() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Bid Activity</h1>
            <p>Track all bidding activity across your auctions.</p>
          </div>
        </div>
        
        <div className="auct-section" style={{padding: 0}}>
          <div style={{padding: '20px', borderBottom: '1px solid #f0ebf5', display: 'flex', gap: '15px'}}>
            <select className="a-btn"><option>All Auctions ▾</option></select>
            <select className="a-btn"><option>Last 7 Days ▾</option></select>
            <input type="text" className="a-btn" placeholder="🔍 Search bidders, items..." style={{flex: 1, cursor: 'text'}} />
          </div>

          <table className="auct-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Bidder</th>
                <th>Bid Amount</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{background: '#fcf9f5'}}>
                <td><div className="a-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Rolex Datejust</span></div></td>
                <td>Rahul S.</td>
                <td style={{fontWeight: 700}}>₹ 4,20,000</td>
                <td>10:12 AM</td>
                <td><span className="a-badge badge-highest">Highest</span></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/home/home-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Vintage Chandelier</span></div></td>
                <td>Priya M.</td>
                <td style={{fontWeight: 700}}>₹ 1,20,000</td>
                <td>09:45 AM</td>
                <td><span className="a-badge badge-outbid">Outbid</span></td>
              </tr>
              <tr style={{background: '#fcf9f5'}}>
                <td><div className="a-item-cell"><img src="/auctions/art/art-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Modern Art Painting</span></div></td>
                <td>Amit K.</td>
                <td style={{fontWeight: 700}}>₹ 80,000</td>
                <td>08:12 AM</td>
                <td><span className="a-badge badge-highest">Highest</span></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/home/home-01.png" className="a-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Antique Vase</span></div></td>
                <td>Neha K.</td>
                <td style={{fontWeight: 700}}>₹ 60,000</td>
                <td>Sep 23</td>
                <td><span className="a-badge badge-outbid">Outbid</span></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/fashion/fashion-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Designer Handbag</span></div></td>
                <td>Karan T.</td>
                <td style={{fontWeight: 700}}>₹ 55,000</td>
                <td>Sep 22</td>
                <td><span className="a-badge badge-outbid">Outbid</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
