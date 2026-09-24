
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AdminDashboard.css';

export default function Orders() {
  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        <div className="admin-header-row">
          <div>
            <h1>Orders</h1>
            <p>Manage orders and delivery status.</p>
          </div>
        </div>
        
        <div className="admin-section" style={{padding: 0}}>
          <div className="ad-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="ad-tab active">All Orders (58)</div>
            <div className="ad-tab">To Ship (12)</div>
            <div className="ad-tab">Shipped (32)</div>
            <div className="ad-tab">Delivered (20)</div>
            <div className="ad-tab">Cancelled (4)</div>
          </div>
          
          <div style={{padding: '15px 20px', borderBottom: '1px solid #f0ebf5', display: 'flex', gap: '15px'}}>
            <input type="text" className="ad-btn" placeholder="🔍 Search orders..." style={{flex: 1, cursor: 'text'}} />
            <select className="ad-btn"><option>All Status ▾</option></select>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: 600}}>#ORD001</td>
                <td><div className="ad-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Vintage Watch</span></div></td>
                <td>Rahul S.</td>
                <td>Priya M.</td>
                <td>₹ 4,20,000</td>
                <td><span className="ad-badge badge-pending">To Ship</span></td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD002</td>
                <td><div className="ad-item-cell"><img src="/auctions/home/home-01.png" className="ad-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Antique Vase</span></div></td>
                <td>Amit K.</td>
                <td>Neha K.</td>
                <td>₹ 62,000</td>
                <td><span className="ad-badge badge-shipped">Shipped</span></td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD004</td>
                <td><div className="ad-item-cell"><img src="/auctions/art/art-01.png" className="ad-item-img"/><span style={{fontWeight: 600}}>Art Painting</span></div></td>
                <td>Sneha R.</td>
                <td>Amit K.</td>
                <td>₹ 85,000</td>
                <td><span className="ad-badge badge-delivered">Delivered</span></td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD005</td>
                <td><div className="ad-item-cell"><img src="/auctions/vehicles/vehicles-01.png" className="ad-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Car Model</span></div></td>
                <td>Karan T.</td>
                <td>Sneha R.</td>
                <td>₹ 1,12,000</td>
                <td><span className="ad-badge badge-cancelled">Cancelled</span></td>
                <td><button className="ad-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
