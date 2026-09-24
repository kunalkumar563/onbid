
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './VerifierDashboard.css';

export default function Settings() {
  return (
    <DashboardLayout role="verifier">
      <div className="verifier-page">
        <div className="verifier-header-row">
          <div>
            <h1>Settings</h1>
            <p>Manage your verification preferences.</p>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '40px'}}>
          <div style={{width: '250px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{padding: '12px 15px', background: '#e0e0e0', borderRadius: '8px', fontWeight: 600, fontSize: '14px'}}>⚙ General</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🔔 Notifications</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🛡️ Verification</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🔒 Privacy</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🎨 Appearance</div>
            </div>
          </div>
          
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '30px'}}>
            <div className="verifier-section" style={{margin: 0}}>
              <h3 style={{marginTop: 0, marginBottom: '25px', fontSize: '16px'}}>General Settings</h3>
              
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Language</label>
                <select className="v-btn" style={{width: '100%', maxWidth: '400px'}}><option>English (India)</option></select>
              </div>
              
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Timezone</label>
                <select className="v-btn" style={{width: '100%', maxWidth: '400px'}}><option>(GMT+05:30) India Standard Time</option></select>
              </div>
            </div>
            
            <div className="verifier-section" style={{margin: 0}}>
              <h3 style={{marginTop: 0, marginBottom: '25px', fontSize: '16px'}}>Notifications</h3>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0ebf5'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>New verification requests</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Get notified when a new item is submitted for verification</div>
                </div>
                <div style={{width: '40px', height: '20px', background: '#4b2ab5', borderRadius: '10px', position: 'relative'}}>
                  <div style={{width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '22px'}}></div>
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0ebf5'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>Scheduled reminders</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Get reminded before an upcoming verification appointment</div>
                </div>
                <div style={{width: '40px', height: '20px', background: '#4b2ab5', borderRadius: '10px', position: 'relative'}}>
                  <div style={{width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '22px'}}></div>
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>System updates</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Receive platform updates and announcements</div>
                </div>
                <div style={{width: '40px', height: '20px', background: '#4b2ab5', borderRadius: '10px', position: 'relative'}}>
                  <div style={{width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '22px'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
