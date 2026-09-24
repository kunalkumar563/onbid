
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './SellerDashboard.css';

export default function Verification() {
  return (
    <DashboardLayout role="seller">
      <div className="seller-page">
        <div className="seller-header-row">
          <div>
            <h1>Verification</h1>
            <p>Track the verification status of your listings and documents.</p>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '30px'}}>
          <div className="seller-section" style={{flex: 2, padding: 0}}>
            <div className="s-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
              <div className="s-tab active">Pending (3)</div>
              <div className="s-tab">Approved (7)</div>
              <div className="s-tab">Rejected (1)</div>
            </div>
            
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Submitted On</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div className="s-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="s-item-img"/><span style={{fontWeight: 600}}>Rolex Datejust Watch</span></div></td>
                  <td>Sep 21, 2025</td>
                  <td><span className="seller-badge badge-under-review">Under Review</span></td>
                  <td>-</td>
                  <td><button className="s-btn-link">View</button></td>
                </tr>
                <tr>
                  <td><div className="s-item-cell"><img src="/auctions/art/art-01.png" className="s-item-img"/><span style={{fontWeight: 600}}>Antique Painting</span></div></td>
                  <td>Sep 18, 2025</td>
                  <td><span className="seller-badge badge-approved">Approved</span></td>
                  <td>Authentic</td>
                  <td><button className="s-btn-link">View</button></td>
                </tr>
                <tr>
                  <td><div className="s-item-cell"><img src="/auctions/home/home-01.png" className="s-item-img"/><span style={{fontWeight: 600}}>Vintage Vase</span></div></td>
                  <td>Sep 16, 2025</td>
                  <td><span className="seller-badge badge-under-review">Under Review</span></td>
                  <td>-</td>
                  <td><button className="s-btn-link">View</button></td>
                </tr>
                <tr>
                  <td><div className="s-item-cell"><img src="/auctions/fashion/fashion-01.png" className="s-item-img"/><span style={{fontWeight: 600}}>Designer Handbag</span></div></td>
                  <td>Sep 14, 2025</td>
                  <td><span className="seller-badge badge-rejected">Rejected</span></td>
                  <td>Need clearer images</td>
                  <td><button className="s-btn-link">Edit</button></td>
                </tr>
                <tr>
                  <td><div className="s-item-cell"><img src="/auctions/home/home-01.png" className="s-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Crystal Chandelier</span></div></td>
                  <td>Sep 12, 2025</td>
                  <td><span className="seller-badge badge-approved">Approved</span></td>
                  <td>Verified</td>
                  <td><button className="s-btn-link">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="seller-section" style={{flex: 1, alignSelf: 'flex-start'}}>
            <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '16px'}}>Verification Guidelines</h3>
            <ul style={{paddingLeft: '20px', margin: '0 0 25px 0', display: 'flex', flexDirection: 'column', gap: '15px', color: '#444', fontSize: '14px'}}>
              <li><strong style={{color: '#1a1025'}}>✓ Provide clear, high-quality images</strong></li>
              <li><strong style={{color: '#1a1025'}}>✓ Share authenticity documents</strong></li>
              <li><strong style={{color: '#1a1025'}}>✓ Ensure accurate item details</strong></li>
              <li><strong style={{color: '#1a1025'}}>✓ Our team will review within 1-3 business days</strong></li>
            </ul>
            <button className="s-btn s-btn-primary" style={{width: '100%'}}>Learn More</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
