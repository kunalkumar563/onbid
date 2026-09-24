
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './SellerDashboard.css';

export default function Settings() {
  return (
    <DashboardLayout role="seller">
      <div className="seller-page">
        <div className="seller-header-row">
          <div>
            <h1>Account Settings</h1>
            <p>Manage your profile and preferences.</p>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '40px'}}>
          <div style={{width: '250px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{padding: '12px 15px', background: '#e0e0e0', borderRadius: '8px', fontWeight: 600, fontSize: '14px'}}>👤 Profile</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🔔 Notifications</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>💳 Payment Details</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>⚙️ Preferences</div>
            </div>
          </div>
          
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '30px'}}>
            <div className="seller-section" style={{margin: 0}}>
              <h3 style={{marginTop: 0, marginBottom: '25px', fontSize: '16px'}}>Profile Information</h3>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px'}}>
                <div style={{width: '60px', height: '60px', borderRadius: '50%', background: '#4b2ab5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px'}}>TU</div>
                <button className="s-btn">Upload Photo</button>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Full Name</label>
                  <input type="text" className="s-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} defaultValue="Test User" />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Email Address</label>
                  <input type="email" className="s-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} defaultValue="test@example.com" />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Phone Number</label>
                  <input type="text" className="s-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} defaultValue="+91 9876543210" />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Store/Business Name</label>
                  <input type="text" className="s-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} placeholder="Optional" />
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <button className="s-btn s-btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
