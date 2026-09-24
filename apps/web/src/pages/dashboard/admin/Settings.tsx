
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AdminDashboard.css';

export default function Settings() {
  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        <div className="admin-header-row">
          <div>
            <h1>Settings</h1>
            <p>Manage platform configuration and preferences.</p>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '40px'}}>
          <div style={{width: '250px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{padding: '12px 15px', background: '#e0e0e0', borderRadius: '8px', fontWeight: 600, fontSize: '14px'}}>⚙ General Settings</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🛡️ Security</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>💳 Payment Settings</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>📧 Email Templates</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>⚙ Platform Settings</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🎨 Appearance</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>📊 System Logs</div>
            </div>
          </div>
          
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '30px'}}>
            <div className="admin-section" style={{margin: 0}}>
              <h3 style={{marginTop: 0, marginBottom: '25px', fontSize: '16px'}}>General Settings</h3>
              
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Platform Name</label>
                <input type="text" className="ad-btn" style={{width: '100%', maxWidth: '400px', cursor: 'text'}} defaultValue="ONBID Auction House" />
              </div>
              
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Timezone</label>
                <select className="ad-btn" style={{width: '100%', maxWidth: '400px'}}><option>(GMT+05:30) India Standard Time ▾</option></select>
              </div>
              
              <div style={{marginBottom: '30px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Default Currency</label>
                <select className="ad-btn" style={{width: '100%', maxWidth: '400px'}}><option>INR (₹) ▾</option></select>
              </div>
              
              <h3 style={{marginTop: '40px', marginBottom: '25px', fontSize: '16px', borderTop: '1px solid #f0ebf5', paddingTop: '30px'}}>Maintenance & Access</h3>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0ebf5'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>Maintenance Mode</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Temporarily disable platform access for users</div>
                </div>
                <div style={{width: '40px', height: '20px', background: '#ccc', borderRadius: '10px', position: 'relative'}}>
                  <div style={{width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px'}}></div>
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0ebf5'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>New User Registration</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Allow new users to sign up</div>
                </div>
                <div style={{width: '40px', height: '20px', background: '#4b2ab5', borderRadius: '10px', position: 'relative'}}>
                  <div style={{width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '22px'}}></div>
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>System Notifications</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Enable global system notifications</div>
                </div>
                <div style={{width: '40px', height: '20px', background: '#4b2ab5', borderRadius: '10px', position: 'relative'}}>
                  <div style={{width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '22px'}}></div>
                </div>
              </div>
              
              <div style={{marginTop: '30px'}}>
                <button className="ad-btn ad-btn-primary" style={{padding: '10px 30px'}}>Save Settings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
