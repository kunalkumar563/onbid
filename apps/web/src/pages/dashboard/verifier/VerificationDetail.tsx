
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './VerifierDashboard.css';

export default function VerificationDetail() {
  const navigate = useNavigate();
  return (
    <DashboardLayout role="verifier">
      <div className="verifier-page">
        <div style={{cursor: 'pointer', color: '#666', fontSize: '13px', marginBottom: '20px'}} onClick={() => navigate(-1)}>
          ← Back to Queue
        </div>
        
        <div className="v-detail-header">
          <div>
            <h1 style={{margin: '0 0 5px 0', fontSize: '28px', color: '#1a1025'}}>Patek Philippe Watch <span className="verifier-badge badge-pending" style={{marginLeft: '10px', fontSize: '12px'}}>Pending Review</span></h1>
            <p style={{margin: 0, color: '#888', fontSize: '13px'}}>#VR10082</p>
          </div>
          <div className="v-detail-actions">
            <button className="v-btn" style={{color: '#d32f2f', borderColor: '#d32f2f'}}>Reject</button>
            <button className="v-btn v-btn-primary">Approve</button>
          </div>
        </div>

        <div className="v-tabs">
          <div className="v-tab active">Item Details</div>
          <div className="v-tab">Images (4)</div>
          <div className="v-tab">Documents (2)</div>
          <div className="v-tab">Seller Info</div>
          <div className="v-tab">History</div>
        </div>

        <div className="v-detail-grid">
          <div>
            <img src="/auctions/jewelry/jewelry-01.png" className="v-detail-main-img" />
            <div className="v-detail-thumbs">
              <img src="/auctions/jewelry/jewelry-01.png" className="v-detail-thumb" />
              <img src="/auctions/jewelry/jewelry-01.png" className="v-detail-thumb" />
              <img src="/auctions/jewelry/jewelry-01.png" className="v-detail-thumb" />
              <img src="/auctions/jewelry/jewelry-01.png" className="v-detail-thumb" />
            </div>
          </div>
          
          <div className="verifier-section" style={{margin: 0}}>
            <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '16px'}}>Item Information</h3>
            <div className="v-info-row">
              <div className="v-info-label">Category</div>
              <div className="v-info-value">Watches & Jewelry</div>
            </div>
            <div className="v-info-row">
              <div className="v-info-label">Sub-category</div>
              <div className="v-info-value">Luxury Watches</div>
            </div>
            <div className="v-info-row">
              <div className="v-info-label">Brand</div>
              <div className="v-info-value">Patek Philippe</div>
            </div>
            <div className="v-info-row">
              <div className="v-info-label">Model</div>
              <div className="v-info-value">Datejust</div>
            </div>
            <div className="v-info-row">
              <div className="v-info-label">Condition</div>
              <div className="v-info-value">Excellent</div>
            </div>
            <div className="v-info-row">
              <div className="v-info-label">Year</div>
              <div className="v-info-value">2022</div>
            </div>
            <div className="v-info-row">
              <div className="v-info-label">Starting Price</div>
              <div className="v-info-value">₹ 12,50,000</div>
            </div>
            <div className="v-info-row" style={{border: 'none'}}>
              <div className="v-info-label">Description</div>
              <div className="v-info-value" style={{fontWeight: 400, color: '#555', lineHeight: '1.5'}}>
                Authentic Patek Philippe Datejust with original box and papers. Excellent condition.
              </div>
            </div>
            
            <h3 style={{marginTop: '30px', marginBottom: '15px', fontSize: '16px'}}>Seller Information</h3>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <div style={{width: '32px', height: '32px', background: '#e0e0e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold'}}>RS</div>
                <span style={{fontWeight: 600, fontSize: '14px'}}>Rahul S.</span>
              </div>
              <button className="v-btn" style={{border: 'none', padding: 0}}>View Profile</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
