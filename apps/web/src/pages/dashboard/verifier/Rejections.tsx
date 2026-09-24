
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './VerifierDashboard.css';

export default function Rejections() {
  return (
    <DashboardLayout role="verifier">
      <div className="verifier-page">
        <div className="verifier-header-row">
          <div>
            <h1>Rejected Items</h1>
            <p>Items that were not approved with reasons.</p>
          </div>
        </div>
        <div className="verifier-section" style={{padding: 0}}>
          <div className="v-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="v-tab active">All (6)</div>
            <div className="v-tab">Incomplete Docs (2)</div>
            <div className="v-tab">Not Authentic (3)</div>
            <div className="v-tab">Poor Condition (1)</div>
          </div>
          <table className="verifier-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Rejected On</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="v-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Replica Watch</span></div></td>
                <td>Watches</td>
                <td>Sep 22, 2025</td>
                <td><span style={{color: '#d32f2f', fontWeight: 500, fontSize: '13px'}}>Suspected replica</span></td>
                <td><button className="v-btn">View</button></td>
              </tr>
              <tr>
                <td><div className="v-item-cell"><img src="/auctions/home/home-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Damaged Vase</span></div></td>
                <td>Home & Decor</td>
                <td>Sep 21, 2025</td>
                <td><span style={{color: '#d32f2f', fontWeight: 500, fontSize: '13px'}}>Poor condition</span></td>
                <td><button className="v-btn">View</button></td>
              </tr>
              <tr>
                <td><div className="v-item-cell"><img src="/auctions/art/art-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Fake Painting</span></div></td>
                <td>Art & Collectibles</td>
                <td>Sep 19, 2025</td>
                <td><span style={{color: '#d32f2f', fontWeight: 500, fontSize: '13px'}}>Authenticity failed</span></td>
                <td><button className="v-btn">View</button></td>
              </tr>
              <tr>
                <td><div className="v-item-cell"><img src="/auctions/fashion/fashion-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Incomplete Docs</span></div></td>
                <td>Fashion</td>
                <td>Sep 18, 2025</td>
                <td><span style={{color: '#d32f2f', fontWeight: 500, fontSize: '13px'}}>Missing certificates</span></td>
                <td><button className="v-btn">View</button></td>
              </tr>
              <tr>
                <td><div className="v-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="v-item-img"/><span style={{fontWeight: 600}}>Altered Gem</span></div></td>
                <td>Jewelry</td>
                <td>Sep 17, 2025</td>
                <td><span style={{color: '#d32f2f', fontWeight: 500, fontSize: '13px'}}>Item not as described</span></td>
                <td><button className="v-btn">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
