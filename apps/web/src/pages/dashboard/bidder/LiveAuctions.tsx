
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function LiveAuctions() {
  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>Live Auctions</h1>
            <p>Bid on unique items from verified sellers around the world.</p>
          </div>
        </div>
        
        <div className="bidder-section" style={{padding: '0 0 30px 0', background: 'transparent', border: 'none', boxShadow: 'none'}}>
          <div className="b-tabs" style={{marginBottom: '30px', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px'}}>
            <div className="b-tab active">All Categories</div>
            <div className="b-tab">Art & Collectibles</div>
            <div className="b-tab">Watches</div>
            <div className="b-tab">Jewelry</div>
            <div className="b-tab">Home & Decor</div>
            <div className="b-tab">Fashion</div>
            <div style={{marginLeft: 'auto'}}>
              <select className="b-btn"><option>Sort: Ending Soon ▾</option></select>
            </div>
          </div>

          <div className="b-auction-grid">
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/home/home-01.png" className="b-auction-img" />
                <div className="b-live-badge">LIVE</div>
                <button className="b-watchlist-btn">♡</button>
              </div>
              <div className="b-auction-content">
                <h3 className="b-auction-title">Vintage Crystal Chandelier</h3>
                <div className="b-auction-details">
                  <div>
                    <div className="b-auction-price">₹ 1,25,000</div>
                    <div className="b-auction-label" style={{color: '#d32f2f', fontWeight: 600}}>4h 32m left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="b-auction-label">24 bids</div>
                  </div>
                </div>
                <button className="b-btn b-btn-primary" style={{width: '100%'}}>Place Bid</button>
              </div>
            </div>
            
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/jewelry/jewelry-01.png" className="b-auction-img" />
                <div className="b-ending-badge">ENDING SOON</div>
                <button className="b-watchlist-btn">♡</button>
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
                <button className="b-btn b-btn-primary" style={{width: '100%'}}>Place Bid</button>
              </div>
            </div>
            
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/art/art-01.png" className="b-auction-img" />
                <div className="b-live-badge">LIVE</div>
                <button className="b-watchlist-btn">♡</button>
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
                <button className="b-btn b-btn-primary" style={{width: '100%'}}>Place Bid</button>
              </div>
            </div>
            
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/home/home-01.png" className="b-auction-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/>
                <div className="b-live-badge">LIVE</div>
                <button className="b-watchlist-btn">♡</button>
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
                <button className="b-btn b-btn-primary" style={{width: '100%'}}>Place Bid</button>
              </div>
            </div>
            
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/fashion/fashion-01.png" className="b-auction-img" />
                <div className="b-live-badge">LIVE</div>
                <button className="b-watchlist-btn">♡</button>
              </div>
              <div className="b-auction-content">
                <h3 className="b-auction-title">Louis Vuitton Handbag</h3>
                <div className="b-auction-details">
                  <div>
                    <div className="b-auction-price">₹ 3,10,000</div>
                    <div className="b-auction-label">2d 4h left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="b-auction-label">27 bids</div>
                  </div>
                </div>
                <button className="b-btn b-btn-primary" style={{width: '100%'}}>Place Bid</button>
              </div>
            </div>
            
            <div className="b-auction-card">
              <div className="b-auction-img-wrapper">
                <img src="/auctions/vehicles/vehicles-01.png" className="b-auction-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/>
                <div className="b-live-badge">LIVE</div>
                <button className="b-watchlist-btn">♡</button>
              </div>
              <div className="b-auction-content">
                <h3 className="b-auction-title">Classic Car Model</h3>
                <div className="b-auction-details">
                  <div>
                    <div className="b-auction-price">₹ 12,50,000</div>
                    <div className="b-auction-label">6d 14h left</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="b-auction-label">41 bids</div>
                  </div>
                </div>
                <button className="b-btn b-btn-primary" style={{width: '100%'}}>Place Bid</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
