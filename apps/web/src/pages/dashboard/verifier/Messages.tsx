
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './VerifierDashboard.css';

export default function Messages() {
  return (
    <DashboardLayout role="verifier">
      <div className="verifier-page">
        <div className="verifier-header-row">
          <div>
            <h1>Messages</h1>
            <p>Communicate with sellers, buyers, and support team.</p>
          </div>
        </div>
        
        <div className="verifier-section" style={{display: 'flex', padding: 0, height: '600px'}}>
          <div style={{width: '350px', borderRight: '1px solid #f0ebf5', display: 'flex', flexDirection: 'column'}}>
            <div style={{padding: '20px', borderBottom: '1px solid #f0ebf5'}}>
              <input type="text" className="v-btn" style={{width: '100%', boxSizing: 'border-box', cursor: 'text'}} placeholder="Search messages..." />
            </div>
            
            <div style={{flex: 1, overflowY: 'auto'}}>
              <div style={{padding: '20px', display: 'flex', gap: '15px', background: '#fcf9f5', borderLeft: '4px solid #4b2ab5', cursor: 'pointer'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#4b2ab5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>RS</div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                    <span style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>Rahul S.</span>
                    <span style={{fontSize: '12px', color: '#888'}}>10:24 AM</span>
                  </div>
                  <div style={{fontSize: '13px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Thank you for the approval!</div>
                </div>
              </div>
              
              <div style={{padding: '20px', display: 'flex', gap: '15px', borderBottom: '1px solid #f0ebf5', cursor: 'pointer'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#e0e0e0', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>PM</div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                    <span style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>Priya M.</span>
                    <span style={{fontSize: '12px', color: '#888'}}>Yesterday</span>
                  </div>
                  <div style={{fontSize: '13px', color: '#666'}}>Can you please check...</div>
                </div>
              </div>
              
              <div style={{padding: '20px', display: 'flex', gap: '15px', borderBottom: '1px solid #f0ebf5', cursor: 'pointer'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#1a1025', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>OS</div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                    <span style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>ONBID Support</span>
                    <span style={{fontSize: '12px', color: '#888'}}>Sep 22</span>
                  </div>
                  <div style={{fontSize: '13px', color: '#666'}}>New verification guidelines</div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa'}}>
            <div style={{padding: '20px', borderBottom: '1px solid #f0ebf5', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#4b2ab5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>RS</div>
                <div>
                  <div style={{fontWeight: 600, fontSize: '15px', color: '#1a1025'}}>Rahul S.</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Online</div>
                </div>
              </div>
              <button className="v-btn">View Listing</button>
            </div>
            
            <div style={{flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div style={{alignSelf: 'flex-start', background: 'white', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '12px 12px 12px 0', maxWidth: '70%'}}>
                <div style={{fontSize: '14px', color: '#333'}}>Hi, is my item verified?</div>
                <div style={{fontSize: '10px', color: '#888', marginTop: '5px', textAlign: 'right'}}>10:20 AM</div>
              </div>
              
              <div style={{alignSelf: 'flex-end', background: '#4b2ab5', color: 'white', padding: '15px', borderRadius: '12px 12px 0 12px', maxWidth: '70%'}}>
                <div style={{fontSize: '14px'}}>Yes, it has been verified. You can now proceed with the listing.</div>
                <div style={{fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '5px', textAlign: 'right'}}>10:22 AM</div>
              </div>
              
              <div style={{alignSelf: 'flex-start', background: 'white', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '12px 12px 12px 0', maxWidth: '70%'}}>
                <div style={{fontSize: '14px', color: '#333'}}>Thank you for the quick review!</div>
                <div style={{fontSize: '10px', color: '#888', marginTop: '5px', textAlign: 'right'}}>10:24 AM</div>
              </div>
            </div>
            
            <div style={{padding: '20px', background: 'white', borderTop: '1px solid #f0ebf5', display: 'flex', gap: '15px'}}>
              <input type="text" className="v-btn" style={{flex: 1, cursor: 'text'}} placeholder="Type a message..." />
              <button className="v-btn v-btn-primary" style={{borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>➤</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
