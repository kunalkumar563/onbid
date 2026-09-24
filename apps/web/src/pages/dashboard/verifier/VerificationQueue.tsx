
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './VerifierDashboard.css';

export default function VerificationQueue() {
  const navigate = useNavigate();
  return (
    <DashboardLayout role="verifier">
      <div className="verifier-page">
        <div className="verifier-header-row">
          <div>
            <h1>Verification Queue</h1>
            <p>Review and verify item details, images, and documentation.</p>
          </div>
        </div>

        <div className="verifier-section" style={{padding: '0'}}>
          <div className="v-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="v-tab active">All (24)</div>
            <div className="v-tab">High Priority (8)</div>
            <div className="v-tab">Standard (12)</div>
            <div className="v-tab">Flagged (4)</div>
          </div>
          
          <div style={{padding: '20px', display: 'flex', gap: '15px'}}>
            <select className="v-btn"><option>All Categories</option></select>
            <select className="v-btn"><option>All Conditions</option></select>
            <select className="v-btn" style={{marginLeft: 'auto'}}><option>Newest First</option></select>
          </div>

          <table className="verifier-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Submitted By</th>
                <th>Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="v-item-cell">
                    <img src="/auctions/jewelry/jewelry-01.png" className="v-item-img"/>
                    <span style={{fontWeight: 600}}>Patek Philippe Watch</span>
                  </div>
                </td>
                <td>Watches</td>
                <td>Rahul S.</td>
                <td>Sep 24, 2025</td>
                <td><span className="verifier-badge badge-high">High</span></td>
                <td><span className="verifier-badge badge-pending">Pending</span></td>
                <td><button className="v-btn" onClick={() => navigate('/dashboard/verifier/queue/1')}>Review</button></td>
              </tr>
              <tr>
                <td>
                  <div className="v-item-cell">
                    <img src="/auctions/home/home-01.png" className="v-item-img"/>
                    <span style={{fontWeight: 600}}>Vintage Chandelier</span>
                  </div>
                </td>
                <td>Home & Decor</td>
                <td>Neha K.</td>
                <td>Sep 24, 2025</td>
                <td><span className="verifier-badge badge-high">High</span></td>
                <td><span className="verifier-badge badge-pending">Pending</span></td>
                <td><button className="v-btn" onClick={() => navigate('/dashboard/verifier/queue/2')}>Review</button></td>
              </tr>
              <tr>
                <td>
                  <div className="v-item-cell">
                    <img src="/auctions/art/art-01.png" className="v-item-img"/>
                    <span style={{fontWeight: 600}}>Modern Art Painting</span>
                  </div>
                </td>
                <td>Art & Collectibles</td>
                <td>Priya M.</td>
                <td>Sep 23, 2025</td>
                <td><span className="verifier-badge badge-standard">Standard</span></td>
                <td><span className="verifier-badge badge-pending">Pending</span></td>
                <td><button className="v-btn" onClick={() => navigate('/dashboard/verifier/queue/3')}>Review</button></td>
              </tr>
              <tr>
                <td>
                  <div className="v-item-cell">
                    <img src="/auctions/home/home-01.png" className="v-item-img"/>
                    <span style={{fontWeight: 600}}>Antique Vase</span>
                  </div>
                </td>
                <td>Home & Decor</td>
                <td>Amit K.</td>
                <td>Sep 23, 2025</td>
                <td><span className="verifier-badge badge-standard">Standard</span></td>
                <td><span className="verifier-badge badge-pending">Pending</span></td>
                <td><button className="v-btn">Review</button></td>
              </tr>
              <tr>
                <td>
                  <div className="v-item-cell">
                    <img src="/auctions/fashion/fashion-01.png" className="v-item-img"/>
                    <span style={{fontWeight: 600}}>Designer Handbag</span>
                  </div>
                </td>
                <td>Fashion</td>
                <td>Sneha R.</td>
                <td>Sep 23, 2025</td>
                <td><span className="verifier-badge badge-standard">Standard</span></td>
                <td><span className="verifier-badge badge-pending">Pending</span></td>
                <td><button className="v-btn">Review</button></td>
              </tr>
              <tr>
                <td>
                  <div className="v-item-cell">
                    <img src="/auctions/jewelry/jewelry-01.png" className="v-item-img"/>
                    <span style={{fontWeight: 600}}>Diamond Necklace</span>
                  </div>
                </td>
                <td>Jewelry</td>
                <td>Karan T.</td>
                <td>Sep 22, 2025</td>
                <td><span className="verifier-badge badge-standard">Standard</span></td>
                <td><span className="verifier-badge badge-pending">Pending</span></td>
                <td><button className="v-btn">Review</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
