
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function Settings() {
  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>Settings</h1>
            <p>Customise your experience.</p>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '40px'}}>
          <div style={{width: '250px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{padding: '12px 15px', background: '#e0e0e0', borderRadius: '8px', fontWeight: 600, fontSize: '14px'}}>⚙ General</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🔔 Notifications</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🔒 Privacy</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🎨 Appearance</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🌐 Language</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🛡️ Security</div>
            </div>
          </div>
          
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '30px'}}>
            <div className="bidder-section" style={{margin: 0}}>
              <h3 style={{marginTop: 0, marginBottom: '25px', fontSize: '16px'}}>General Settings</h3>
              
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Language</label>
                <select className="b-btn" style={{width: '100%', maxWidth: '400px'}}><option>English (India)</option></select>
              </div>
              
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Currency</label>
                <select className="b-btn" style={{width: '100%', maxWidth: '400px'}}><option>INR (₹)</option></select>
              </div>
              
              <div style={{marginBottom: '30px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Theme</label>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button className="b-btn b-btn-primary" style={{padding: '8px 20px', borderRadius: '20px'}}>Light</button>
                  <button className="b-btn" style={{padding: '8px 20px', borderRadius: '20px', background: 'transparent'}}>Dark</button>
                </div>
              </div>
              
              <h3 style={{marginTop: '40px', marginBottom: '25px', fontSize: '16px', borderTop: '1px solid #f0ebf5', paddingTop: '30px'}}>Notifications</h3>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0ebf5'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>Email Notifications</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Receive updates about your bids and orders</div>
                </div>
                <div style={{width: '40px', height: '20px', background: '#4b2ab5', borderRadius: '10px', position: 'relative'}}>
                  <div style={{width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '22px'}}></div>
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0ebf5'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>SMS Notifications</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Important alerts via SMS</div>
                </div>
                <div style={{width: '40px', height: '20px', background: '#4b2ab5', borderRadius: '10px', position: 'relative'}}>
                  <div style={{width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '22px'}}></div>
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>Marketing Emails</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Receive news and offers</div>
                </div>
                <div style={{width: '40px', height: '20px', background: '#ccc', borderRadius: '10px', position: 'relative'}}>
                  <div style={{width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
