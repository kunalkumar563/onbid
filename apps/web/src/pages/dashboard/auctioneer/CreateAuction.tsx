
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function CreateAuction() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Create New Auction</h1>
            <p>List a unique item and reach global collectors.</p>
          </div>
        </div>
        
        <div className="auct-section">
          <div className="a-create-steps">
            <div className="a-step active"><div className="a-step-num">1</div> Basic Info</div>
            <div style={{flex: 1, borderTop: '1px dashed #ccc', margin: 'auto 10px'}}></div>
            <div className="a-step"><div className="a-step-num">2</div> Details</div>
            <div style={{flex: 1, borderTop: '1px dashed #ccc', margin: 'auto 10px'}}></div>
            <div className="a-step"><div className="a-step-num">3</div> Media</div>
            <div style={{flex: 1, borderTop: '1px dashed #ccc', margin: 'auto 10px'}}></div>
            <div className="a-step"><div className="a-step-num">4</div> Schedule</div>
          </div>
          
          <div style={{display: 'flex', gap: '40px'}}>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Title / Item Name *</label>
                <input type="text" className="a-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} defaultValue="Vintage Crystal Chandelier" />
              </div>
              
              <div>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Category *</label>
                <select className="a-btn" style={{width: '100%', background: '#fafafa'}}><option>Select Category</option></select>
              </div>
              
              <div>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Sub-category *</label>
                <select className="a-btn" style={{width: '100%', background: '#fafafa'}}><option>Select Sub-category</option></select>
              </div>
              
              <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Starting Bid (₹) *</label>
                  <input type="text" className="a-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} defaultValue="90,000" />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Buy Now Price (Optional)</label>
                  <input type="text" className="a-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} placeholder="e.g. 1,50,000" />
                </div>
              </div>
              
              <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Auction Start Date *</label>
                  <input type="text" className="a-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} placeholder="📅 Select date" />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Auction End Date *</label>
                  <input type="text" className="a-btn" style={{width: '100%', cursor: 'text', background: '#fafafa'}} placeholder="📅 Select date" />
                </div>
              </div>
              
              <div>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Description *</label>
                <textarea className="a-btn" style={{width: '100%', cursor: 'text', background: '#fafafa', height: '100px', resize: 'none'}} placeholder="Describe your item, its history, condition, and unique features..."></textarea>
                <div style={{textAlign: 'right', fontSize: '11px', color: '#888', marginTop: '5px'}}>0/1000</div>
              </div>
            </div>
            
            <div style={{width: '300px'}}>
              <div style={{fontSize: '14px', fontWeight: 600, marginBottom: '15px'}}>Item Preview</div>
              <div className="a-auction-card" style={{boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
                <div className="a-auction-img-wrapper">
                  <img src="/auctions/home/home-01.png" className="a-auction-img" />
                </div>
                <div className="a-auction-content">
                  <h3 className="a-auction-title">Vintage Crystal Chandelier</h3>
                  <div style={{fontSize: '12px', color: '#666', marginBottom: '15px'}}>Home & Decor</div>
                  <div className="a-auction-details" style={{margin: 0}}>
                    <div>
                      <div className="a-auction-label">Starting Bid</div>
                      <div className="a-auction-price">₹ 90,000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f0ebf5'}}>
            <button className="a-btn">Save as Draft</button>
            <button className="a-btn a-btn-primary" style={{padding: '8px 30px'}}>Next →</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
