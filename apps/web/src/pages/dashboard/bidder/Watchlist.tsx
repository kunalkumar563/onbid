
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function Watchlist() {
  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>My Watchlist</h1>
            <p>Keep track of items you're interested in.</p>
          </div>
        </div>
        
        <div className="bidder-section" style={{padding: '0 0 30px 0', background: 'transparent', border: 'none', boxShadow: 'none'}}>
          <div className="b-tabs" style={{marginBottom: '30px', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px'}}>
            <div className="b-tab active">All Items (12)</div>
            <div className="b-tab">Live Now (5)</div>
            <div className="b-tab">Ending Soon (4)</div>
            <div className="b-tab">Upcoming (2)</div>
            <div className="b-tab">Ended (1)</div>
          </div>

          <div className="b-auction-grid">
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/jewelry/jewelry-01.png" className="b-auction-img" />
                <div className="b-live-badge">LIVE</div>
                <button className="b-watchlist-btn" style={{color: '#e91e63'}}>♥</button>
              </div>
              <div className="b-auction-content">
                <h3 className="b-auction-title">Rolex Datejust Watch</h3>
                <div className="b-auction-details">
                  <div>
                    <div className="b-auction-price">₹ 4,20,000</div>
                    <div className="b-auction-label" style={{color: '#d32f2f', fontWeight: 600}}>2h 15m left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="b-auction-label">32 bids</div>
                  </div>
                </div>
                <button className="b-btn" style={{width: '100%'}}>View Details</button>
              </div>
            </div>
            
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/home/home-01.png" className="b-auction-img" />
                <div className="b-ending-badge">ENDING SOON</div>
                <button className="b-watchlist-btn" style={{color: '#e91e63'}}>♥</button>
              </div>
              <div className="b-auction-content">
                <h3 className="b-auction-title">Vintage Chandelier</h3>
                <div className="b-auction-details">
                  <div>
                    <div className="b-auction-price">₹ 1,25,000</div>
                    <div className="b-auction-label" style={{color: '#d32f2f', fontWeight: 600}}>4h 32m left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="b-auction-label">24 bids</div>
                  </div>
                </div>
                <button className="b-btn" style={{width: '100%'}}>View Details</button>
              </div>
            </div>
            
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/art/art-01.png" className="b-auction-img" />
                <div className="b-live-badge">LIVE</div>
                <button className="b-watchlist-btn" style={{color: '#e91e63'}}>♥</button>
              </div>
              <div className="b-auction-content">
                <h3 className="b-auction-title">Modern Art Painting</h3>
                <div className="b-auction-details">
                  <div>
                    <div className="b-auction-price">₹ 85,000</div>
                    <div className="b-auction-label">1d 6h left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="b-auction-label">18 bids</div>
                  </div>
                </div>
                <button className="b-btn" style={{width: '100%'}}>View Details</button>
              </div>
            </div>
            
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/home/home-01.png" className="b-auction-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/>
                <div className="b-live-badge">LIVE</div>
                <button className="b-watchlist-btn" style={{color: '#e91e63'}}>♥</button>
              </div>
              <div className="b-auction-content">
                <h3 className="b-auction-title">Antique Vase</h3>
                <div className="b-auction-details">
                  <div>
                    <div className="b-auction-price">₹ 62,000</div>
                    <div className="b-auction-label">3d 12h left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="b-auction-label">11 bids</div>
                  </div>
                </div>
                <button className="b-btn" style={{width: '100%'}}>View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
