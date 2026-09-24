
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './VerifierDashboard.css';

export default function Completed() {
  return (
    <DashboardLayout role="verifier">
      <div className="verifier-page">
        <div className="verifier-header-row">
          <div>
            <h1>Completed Verifications</h1>
            <p>View all successfully verified items.</p>
          </div>
        </div>
        <div className="verifier-section" style={{padding: 0}}>
          <div style={{padding: '20px', display: 'flex', gap: '15px'}}>
            <select className="v-btn"><option>All Categories</option></select>
            <select className="v-btn"><option>Last 30 Days</option></select>
            <input type="text" placeholder="Search items..." className="v-btn" style={{marginLeft: 'auto', width: '250px', cursor: 'text'}} />
          </div>
          <table className="verifier-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Verified On</th>
                <th>Verified By</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="v-item-cell"><img src="/auctions/vehicles/vehicles-01.png" className="v-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Classic Car Model</span></div></td>
                <td>Vehicles</td>
                <td>Sep 22, 2025</td>
                <td>You</td>
                <td><span className="verifier-badge badge-completed">Authentic</span></td>
              </tr>
              <tr>
                <td><div className="v-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Diamond Necklace</span></div></td>
                <td>Jewelry</td>
                <td>Sep 21, 2025</td>
                <td>You</td>
                <td><span className="verifier-badge badge-completed">Authentic</span></td>
              </tr>
              <tr>
                <td><div className="v-item-cell"><img src="/auctions/art/art-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Vintage Painting</span></div></td>
                <td>Art & Collectibles</td>
                <td>Sep 20, 2025</td>
                <td>You</td>
                <td><span className="verifier-badge badge-completed">Authentic</span></td>
              </tr>
              <tr>
                <td><div className="v-item-cell"><img src="/auctions/fashion/fashion-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Louis Vuitton Handbag</span></div></td>
                <td>Fashion</td>
                <td>Sep 19, 2025</td>
                <td>You</td>
                <td><span className="verifier-badge badge-completed">Authentic</span></td>
              </tr>
              <tr>
                <td><div className="v-item-cell"><img src="/auctions/home/home-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Antique Clock</span></div></td>
                <td>Home & Decor</td>
                <td>Sep 18, 2025</td>
                <td>You</td>
                <td><span className="verifier-badge badge-completed">Authentic</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
