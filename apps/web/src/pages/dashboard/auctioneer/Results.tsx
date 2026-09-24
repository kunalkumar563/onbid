
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function Results() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Auction Results</h1>
            <p>View completed auctions and winning details.</p>
          </div>
        </div>
        
        <div className="auct-section" style={{padding: 0}}>
          <div className="a-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="a-tab active">All</div>
            <div className="a-tab">Successful (8)</div>
            <div className="a-tab">Unsold (2)</div>
            <div style={{marginLeft: 'auto'}}>
              <select className="a-btn"><option>📅 Last 30 Days ▾</option></select>
            </div>
          </div>
          
          <table className="auct-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Winning Bid</th>
                <th>Winner</th>
                <th>Ended On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/home/home-01.png" className="a-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Antique Vase</span></div></td>
                <td style={{fontWeight: 700}}>₹ 62,000</td>
                <td>Neha K.</td>
                <td>Sep 12, 2025</td>
                <td><span className="a-badge badge-sold">Sold</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/fashion/fashion-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Designer Handbag</span></div></td>
                <td style={{fontWeight: 700}}>₹ 2,10,000</td>
                <td>Amit K.</td>
                <td>Sep 10, 2025</td>
                <td><span className="a-badge badge-sold">Sold</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/vehicles/vehicles-01.png" className="a-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Classic Car Model</span></div></td>
                <td style={{fontWeight: 700}}>₹ 12,50,000</td>
                <td>Rahul S.</td>
                <td>Sep 05, 2025</td>
                <td><span className="a-badge badge-sold">Sold</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Diamond Necklace</span></div></td>
                <td style={{fontWeight: 700}}>-</td>
                <td>-</td>
                <td>Sep 01, 2025</td>
                <td><span className="a-badge badge-unsold">Unsold</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/art/art-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Art Sculpture</span></div></td>
                <td style={{fontWeight: 700}}>₹ 1,10,000</td>
                <td>Priya M.</td>
                <td>Aug 28, 2025</td>
                <td><span className="a-badge badge-sold">Sold</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
