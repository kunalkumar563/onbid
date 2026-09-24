
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function MyAccount() {
  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>My Account</h1>
            <p>Manage your profile and personal information.</p>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '40px'}}>
          <div style={{width: '250px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{padding: '12px 15px', background: '#4b2ab5', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '14px'}}>👤 Profile</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🔔 Notifications</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>💳 Payment Methods</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>📍 Addresses</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>⚙️ Preferences</div>
            </div>
          </div>
          
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '30px'}}>
            <div className="bidder-section" style={{margin: 0}}>
              <h3 style={{marginTop: 0, marginBottom: '25px', fontSize: '16px'}}>Profile Information</h3>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px'}}>
                <div style={{width: '60px', height: '60px', borderRadius: '50%', background: '#4b2ab5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px'}}>TU</div>
                <button className="b-btn">Upload Photo</button>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Full Name</label>
                  <input type="text" className="b-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} defaultValue="Test User" />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Email Address</label>
                  <input type="email" className="b-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} defaultValue="test@example.com" />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Phone Number</label>
                  <input type="text" className="b-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} defaultValue="+91 9876543210" />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Date of Birth</label>
                  <input type="text" className="b-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} placeholder="DD/MM/YYYY" />
                </div>
              </div>
            </div>
            
            <div className="bidder-section" style={{margin: 0}}>
              <h3 style={{marginTop: 0, marginBottom: '25px', fontSize: '16px'}}>Saved Addresses</h3>
              <div style={{border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', marginBottom: '5px'}}>Home</div>
                  <div style={{fontSize: '13px', color: '#666'}}>Jaipur, Rajasthan, India</div>
                </div>
                <button className="b-btn-link">Edit</button>
              </div>
              <div style={{border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', marginBottom: '5px'}}>Office</div>
                  <div style={{fontSize: '13px', color: '#666'}}>Bangalore, Karnataka, India</div>
                </div>
                <button className="b-btn-link">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
