
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './SellerDashboard.css';

export default function MyAuctions() {
  return (
    <DashboardLayout role="seller">
      <div className="seller-page">
        <div className="seller-header-row">
          <div>
            <h1>My Auctions</h1>
            <p>Track your active and past auctions.</p>
          </div>
        </div>

        <div className="seller-section" style={{padding: '0 0 30px 0', background: 'transparent', border: 'none', boxShadow: 'none'}}>
          <div className="s-tabs" style={{marginBottom: '30px'}}>
            <div className="s-tab active">Live (5)</div>
            <div className="s-tab">Upcoming (2)</div>
            <div className="s-tab">Ended (3)</div>
          </div>
          
          <div className="s-auction-grid">
            {/* Card 1 */}
            <div className="s-auction-card">
              <div className="s-auction-img-wrapper">
                <img src="/auctions/home/home-01.png" className="s-auction-img" />
                <div className="s-live-badge">LIVE</div>
              </div>
              <div className="s-auction-content">
                <h3 className="s-auction-title">Vintage Crystal Chandelier</h3>
                <div className="s-auction-details">
                  <div>
                    <div className="s-auction-label">Current Bid</div>
                    <div className="s-auction-price">₹ 65,000</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="s-auction-label">12 bids</div>
                    <div style={{fontWeight: 600, fontSize: '14px', marginTop: '2px'}}>2d 4h left</div>
                  </div>
                </div>
                <button className="s-btn" style={{width: '100%'}}>View Details</button>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="s-auction-card">
              <div className="s-auction-img-wrapper">
                <img src="/auctions/jewelry/jewelry-01.png" className="s-auction-img" />
                <div className="s-live-badge">LIVE</div>
              </div>
              <div className="s-auction-content">
                <h3 className="s-auction-title">Rolex Datejust Watch</h3>
                <div className="s-auction-details">
                  <div>
                    <div className="s-auction-label">Current Bid</div>
                    <div className="s-auction-price">₹ 4,20,000</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="s-auction-label">28 bids</div>
                    <div style={{fontWeight: 600, fontSize: '14px', marginTop: '2px'}}>1d 6h left</div>
                  </div>
                </div>
                <button className="s-btn" style={{width: '100%'}}>View Details</button>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="s-auction-card">
              <div className="s-auction-img-wrapper">
                <img src="/auctions/art/art-01.png" className="s-auction-img" />
                <div className="s-upcoming-badge">Upcoming</div>
              </div>
              <div className="s-auction-content">
                <h3 className="s-auction-title">Modern Art Painting</h3>
                <div className="s-auction-details">
                  <div>
                    <div className="s-auction-label">Starting Bid</div>
                    <div className="s-auction-price">₹ 1,25,000</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div className="s-auction-label">Starts in</div>
                    <div style={{fontWeight: 600, fontSize: '14px', marginTop: '2px'}}>3d 04h</div>
                  </div>
                </div>
                <button className="s-btn" style={{width: '100%'}}>View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
