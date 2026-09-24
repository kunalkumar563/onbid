
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function WonAuctions() {
  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>Won Auctions</h1>
            <p>Items you have successfully won.</p>
          </div>
        </div>
        
        <div className="bidder-section" style={{padding: 0}}>
          <div className="b-tabs" style={{padding: '20px 20px 0', marginBottom: '30px'}}>
            <div className="b-tab active">All (3)</div>
            <div className="b-tab">Pending Payment (1)</div>
            <div className="b-tab">Processing (1)</div>
            <div className="b-tab">Delivered (1)</div>
          </div>
          
          <div style={{padding: '0 25px 25px 25px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px'}}>
            <div className="b-auction-card" style={{display: 'flex', flexDirection: 'column'}}>
              <div className="b-auction-img-wrapper" style={{height: '200px'}}>
                <img src="/auctions/home/home-01.png" className="b-auction-img" />
              </div>
              <div className="b-auction-content" style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <h3 className="b-auction-title">Vintage Crystal Chandelier</h3>
                <p style={{fontSize: '12px', color: '#666', margin: '0 0 15px 0'}}>Home & Garden</p>
                <div style={{fontSize: '18px', fontWeight: 700, color: '#1a1025', marginBottom: '10px'}}>₹ 1,25,000</div>
                <div style={{fontSize: '12px', color: '#666', marginBottom: '15px'}}>Won on: Sep 12, 2025</div>
                <div style={{marginBottom: '20px'}}><span className="b-badge badge-pending">Pending Payment</span></div>
                <div style={{display: 'flex', gap: '10px', marginTop: 'auto'}}>
                  <button className="b-btn" style={{flex: 1}}>View Details</button>
                  <button className="b-btn b-btn-primary" style={{flex: 1}}>Pay Now</button>
                </div>
              </div>
            </div>

            <div className="b-auction-card" style={{display: 'flex', flexDirection: 'column'}}>
              <div className="b-auction-img-wrapper" style={{height: '200px'}}>
                <img src="/auctions/art/art-01.png" className="b-auction-img" />
              </div>
              <div className="b-auction-content" style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <h3 className="b-auction-title">Modern Art Painting</h3>
                <p style={{fontSize: '12px', color: '#666', margin: '0 0 15px 0'}}>Art & Collectibles</p>
                <div style={{fontSize: '18px', fontWeight: 700, color: '#1a1025', marginBottom: '10px'}}>₹ 85,000</div>
                <div style={{fontSize: '12px', color: '#666', marginBottom: '15px'}}>Won on: Aug 28, 2025</div>
                <div style={{marginBottom: '20px'}}><span className="b-badge badge-processing">Processing</span></div>
                <div style={{display: 'flex', gap: '10px', marginTop: 'auto'}}>
                  <button className="b-btn" style={{flex: 1}}>View Details</button>
                  <button className="b-btn" style={{flex: 1}}>Track</button>
                </div>
              </div>
            </div>

            <div className="b-auction-card" style={{display: 'flex', flexDirection: 'column'}}>
              <div className="b-auction-img-wrapper" style={{height: '200px'}}>
                <img src="/auctions/home/home-01.png" className="b-auction-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/>
              </div>
              <div className="b-auction-content" style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <h3 className="b-auction-title">Antique Vase</h3>
                <p style={{fontSize: '12px', color: '#666', margin: '0 0 15px 0'}}>Home & Decor</p>
                <div style={{fontSize: '18px', fontWeight: 700, color: '#1a1025', marginBottom: '10px'}}>₹ 62,000</div>
                <div style={{fontSize: '12px', color: '#666', marginBottom: '15px'}}>Won on: Jul 16, 2025</div>
                <div style={{marginBottom: '20px'}}><span className="b-badge badge-delivered">Delivered</span></div>
                <div style={{display: 'flex', gap: '10px', marginTop: 'auto'}}>
                  <button className="b-btn" style={{flex: 1}}>View Details</button>
                  <button className="b-btn" style={{flex: 1}}>View Tracking</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
