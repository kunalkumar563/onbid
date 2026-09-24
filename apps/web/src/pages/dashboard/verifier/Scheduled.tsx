
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './VerifierDashboard.css';

export default function Scheduled() {
  return (
    <DashboardLayout role="verifier">
      <div className="verifier-page">
        <div className="verifier-header-row">
          <div>
            <h1>Scheduled Verifications</h1>
            <p>Manage your upcoming verification appointments.</p>
          </div>
        </div>
        <div className="verifier-section" style={{padding: 0}}>
          <div className="v-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="v-tab active">Today (5)</div>
            <div className="v-tab">This Week (24)</div>
            <div className="v-tab">Custom Date</div>
            <div style={{marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center'}}>
              <span style={{fontSize: '14px', fontWeight: 600}}>📅 Sep 24, 2025</span>
            </div>
          </div>
          <table className="verifier-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Item</th>
                <th>Category</th>
                <th>Submitted By</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10:00 AM</td>
                <td><div className="v-item-cell"><img src="/auctions/home/home-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Vintage Chandelier</span></div></td>
                <td>Home & Decor</td>
                <td>Neha K.</td>
                <td>Physical</td>
                <td><span className="verifier-badge badge-scheduled">Scheduled</span></td>
                <td><button className="v-btn">Start</button></td>
              </tr>
              <tr>
                <td>11:30 AM</td>
                <td><div className="v-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Rolex Datejust</span></div></td>
                <td>Watches</td>
                <td>Rahul S.</td>
                <td>Document</td>
                <td><span className="verifier-badge badge-scheduled">Scheduled</span></td>
                <td><button className="v-btn">Start</button></td>
              </tr>
              <tr>
                <td>01:00 PM</td>
                <td><div className="v-item-cell"><img src="/auctions/art/art-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Modern Art Painting</span></div></td>
                <td>Art & Collectibles</td>
                <td>Priya M.</td>
                <td>Physical</td>
                <td><span className="verifier-badge badge-scheduled">Scheduled</span></td>
                <td><button className="v-btn">Start</button></td>
              </tr>
              <tr>
                <td>02:30 PM</td>
                <td><div className="v-item-cell"><img src="/auctions/home/home-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Antique Vase</span></div></td>
                <td>Home & Decor</td>
                <td>Amit K.</td>
                <td>Physical</td>
                <td><span className="verifier-badge badge-scheduled">Scheduled</span></td>
                <td><button className="v-btn">Start</button></td>
              </tr>
              <tr>
                <td>04:00 PM</td>
                <td><div className="v-item-cell"><img src="/auctions/fashion/fashion-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Designer Handbag</span></div></td>
                <td>Fashion</td>
                <td>Sneha R.</td>
                <td>Document</td>
                <td><span className="verifier-badge badge-scheduled">Scheduled</span></td>
                <td><button className="v-btn">Start</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
