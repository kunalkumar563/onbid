
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './SellerDashboard.css';

export default function Orders() {
  return (
    <DashboardLayout role="seller">
      <div className="seller-page">
        <div className="seller-header-row">
          <div>
            <h1>Orders</h1>
            <p>Manage completed transactions and order details.</p>
          </div>
        </div>
        
        <div className="seller-section" style={{padding: 0}}>
          <div className="s-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="s-tab active">All Orders</div>
            <div className="s-tab">To Ship</div>
            <div className="s-tab">Shipped</div>
            <div className="s-tab">Delivered</div>
            <div className="s-tab">Canceled</div>
          </div>
          
          <div style={{padding: '20px', display: 'flex', gap: '15px'}}>
            <input type="text" placeholder="Search orders..." className="s-btn" style={{width: '300px', cursor: 'text', textAlign: 'left'}} />
            <select className="s-btn" style={{marginLeft: 'auto'}}><option>Filter ▾</option></select>
          </div>

          <table className="seller-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Buyer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: 600}}>#ORD00121</td>
                <td><div className="s-item-cell"><img src="/auctions/art/art-01.png" className="s-item-img"/><span style={{fontWeight: 600}}>Modern Art Painting</span></div></td>
                <td>Rahul S.</td>
                <td>₹ 1,25,000</td>
                <td><span className="seller-badge badge-delivered">Delivered</span></td>
                <td>Sep 18, 2025</td>
                <td><button className="s-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD00119</td>
                <td><div className="s-item-cell"><img src="/auctions/home/home-01.png" className="s-item-img"/><span style={{fontWeight: 600}}>Vintage Vase</span></div></td>
                <td>Amit K.</td>
                <td>₹ 75,000</td>
                <td><span className="seller-badge badge-shipped">Shipped</span></td>
                <td>Sep 14, 2025</td>
                <td><button className="s-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD00115</td>
                <td><div className="s-item-cell"><img src="/auctions/fashion/fashion-01.png" className="s-item-img"/><span style={{fontWeight: 600}}>Designer Handbag</span></div></td>
                <td>Priya M.</td>
                <td>₹ 2,10,000</td>
                <td><span className="seller-badge badge-delivered">Delivered</span></td>
                <td>Sep 10, 2025</td>
                <td><button className="s-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD00112</td>
                <td><div className="s-item-cell"><img src="/auctions/home/home-01.png" className="s-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Antique Clock</span></div></td>
                <td>Karan T.</td>
                <td>₹ 90,000</td>
                <td><span className="seller-badge badge-canceled">Canceled</span></td>
                <td>Sep 05, 2025</td>
                <td><button className="s-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
