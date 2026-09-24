
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function LiveControl() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Live Auction Control</h1>
            <p>Manage ongoing live auctions in real-time.</p>
          </div>
        </div>
        
        <div className="a-live-control-top">
          <div style={{position: 'relative', width: '200px', height: '200px', borderRadius: '12px', overflow: 'hidden'}}>
            <img src="/auctions/jewelry/jewelry-01.png" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={{position: 'absolute', top: '10px', left: '10px', background: '#d32f2f', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600}}>🔴 LIVE</div>
          </div>
          
          <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <div>
                <h2 style={{margin: '0 0 5px 0', fontSize: '24px'}}>Rolex Datejust Watch</h2>
                <div style={{color: '#666', fontSize: '13px', marginBottom: '5px'}}>Auction ID: #AUC001</div>
                <div style={{color: '#666', fontSize: '13px'}}>Category: <span style={{color: '#1a1025', fontWeight: 500}}>Jewelry & Watches</span></div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{color: '#d32f2f', fontSize: '28px', fontWeight: 700}}>02:15:30</div>
                <div style={{color: '#666', fontSize: '12px'}}>Time Left</div>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '40px', marginTop: '30px', paddingBottom: '30px', borderBottom: '1px solid #f0ebf5'}}>
              <div>
                <div style={{color: '#666', fontSize: '13px', marginBottom: '5px'}}>Current Bid</div>
                <div style={{fontSize: '28px', fontWeight: 700, color: '#1a1025'}}>₹ 4,20,000</div>
              </div>
              <div>
                <div style={{color: '#666', fontSize: '13px', marginBottom: '5px'}}>Total Bids</div>
                <div style={{fontSize: '28px', fontWeight: 700, color: '#1a1025'}}>32</div>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '15px', marginTop: '20px'}}>
              <button className="a-btn" style={{flex: 1, padding: '12px', fontSize: '15px', color: '#1a1025'}}>Pause Auction</button>
              <button className="a-btn a-btn-danger" style={{flex: 1, padding: '12px', fontSize: '15px'}}>End Auction</button>
            </div>
          </div>
        </div>
        
        <div className="auct-section" style={{padding: 0}}>
          <div className="a-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="a-tab active">Live Bids</div>
            <div className="a-tab">Participants (32)</div>
            <div className="a-tab">Activity Log</div>
          </div>
          
          <table className="auct-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Bidder</th>
                <th>Bid Amount</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{background: '#fcf9f5'}}>
                <td>1</td>
                <td style={{fontWeight: 600}}>Rahul S.</td>
                <td style={{fontWeight: 700}}>₹ 4,20,000</td>
                <td>10:12:45 AM</td>
                <td><span className="a-badge badge-highest">Highest</span></td>
              </tr>
              <tr>
                <td>2</td>
                <td>Priya M.</td>
                <td>₹ 4,18,000</td>
                <td>10:10:25 AM</td>
                <td>-</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Amit K.</td>
                <td>₹ 4,00,000</td>
                <td>10:05:11 AM</td>
                <td>-</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Neha K.</td>
                <td>₹ 3,90,000</td>
                <td>10:02:45 AM</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
