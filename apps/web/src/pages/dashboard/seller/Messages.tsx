
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './SellerDashboard.css';

export default function Messages() {
  return (
    <DashboardLayout role="seller">
      <div className="seller-page">
        <div className="seller-header-row">
          <div>
            <h1>Messages</h1>
            <p>Communicate with buyers and ONBID support.</p>
          </div>
        </div>
        
        <div className="seller-section" style={{display: 'flex', padding: 0, height: '600px'}}>
          <div style={{width: '350px', borderRight: '1px solid #f0ebf5', display: 'flex', flexDirection: 'column'}}>
            <div style={{padding: '20px', borderBottom: '1px solid #f0ebf5'}}>
              <input type="text" className="s-btn" style={{width: '100%', boxSizing: 'border-box', cursor: 'text'}} placeholder="Search messages..." />
            </div>
            
            <div style={{flex: 1, overflowY: 'auto'}}>
              <div style={{padding: '20px', display: 'flex', gap: '15px', background: '#fcf9f5', borderLeft: '4px solid #4b2ab5', cursor: 'pointer'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#4b2ab5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>RS</div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                    <span style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>Rahul S.</span>
                    <span style={{fontSize: '12px', color: '#888'}}>10:24 AM</span>
                  </div>
                  <div style={{fontSize: '13px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Is this item still available?</div>
                </div>
              </div>
              
              <div style={{padding: '20px', display: 'flex', gap: '15px', borderBottom: '1px solid #f0ebf5', cursor: 'pointer'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#e0e0e0', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>PM</div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                    <span style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>Priya M.</span>
                    <span style={{fontSize: '12px', color: '#888'}}>Yesterday</span>
                  </div>
                  <div style={{fontSize: '13px', color: '#666'}}>Thank you!</div>
                </div>
              </div>
              
              <div style={{padding: '20px', display: 'flex', gap: '15px', borderBottom: '1px solid #f0ebf5', cursor: 'pointer'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#1a1025', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>OS</div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                    <span style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>ONBID Support</span>
                    <span style={{fontSize: '12px', color: '#888'}}>Sep 21</span>
                  </div>
                  <div style={{fontSize: '13px', color: '#666'}}>Your listing has been approved.</div>
                </div>
              </div>

              <div style={{padding: '20px', display: 'flex', gap: '15px', borderBottom: '1px solid #f0ebf5', cursor: 'pointer'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#e0e0e0', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>AK</div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                    <span style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>Amit K.</span>
                    <span style={{fontSize: '12px', color: '#888'}}>Sep 20</span>
                  </div>
                  <div style={{fontSize: '13px', color: '#666'}}>Can you share more images?</div>
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
              <button className="s-btn-link" style={{fontSize: '20px', color: '#ccc'}}>...</button>
            </div>
            
            <div style={{flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div style={{alignSelf: 'flex-start', background: 'white', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '12px 12px 12px 0', maxWidth: '70%'}}>
                <div style={{fontSize: '14px', color: '#333'}}>Is this item still available?</div>
                <div style={{fontSize: '10px', color: '#888', marginTop: '5px', textAlign: 'right'}}>10:20 AM</div>
              </div>
              
              <div style={{alignSelf: 'flex-end', background: '#4b2ab5', color: 'white', padding: '15px', borderRadius: '12px 12px 0 12px', maxWidth: '70%'}}>
                <div style={{fontSize: '14px'}}>Yes, it's available. Let me know if you need any more details.</div>
                <div style={{fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '5px', textAlign: 'right'}}>10:22 AM</div>
              </div>
              
              <div style={{alignSelf: 'flex-start', background: 'white', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '12px 12px 12px 0', maxWidth: '70%'}}>
                <div style={{fontSize: '14px', color: '#333'}}>Can you share a close-up image?</div>
                <div style={{fontSize: '10px', color: '#888', marginTop: '5px', textAlign: 'right'}}>10:24 AM</div>
              </div>
            </div>
            
            <div style={{padding: '20px', background: 'white', borderTop: '1px solid #f0ebf5', display: 'flex', gap: '15px'}}>
              <input type="text" className="s-btn" style={{flex: 1, cursor: 'text'}} placeholder="Type a message..." />
              <button className="s-btn s-btn-primary" style={{borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>➤</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
