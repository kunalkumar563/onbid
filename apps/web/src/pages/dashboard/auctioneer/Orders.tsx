
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function Orders() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Orders</h1>
            <p>Manage orders generated from won auctions.</p>
          </div>
        </div>
        
        <div className="auct-section" style={{padding: 0}}>
          <div className="a-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="a-tab active">All Orders (8)</div>
            <div className="a-tab">Pending (2)</div>
            <div className="a-tab">Shipped (3)</div>
            <div className="a-tab">Delivered (3)</div>
          </div>
          
          <div style={{padding: '15px 20px', borderBottom: '1px solid #f0ebf5', display: 'flex', gap: '15px'}}>
            <input type="text" className="a-btn" placeholder="🔍 Search orders..." style={{flex: 1, cursor: 'text'}} />
            <select className="a-btn"><option>Filter ▾</option></select>
          </div>

          <table className="auct-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Buyer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: 600}}>#ORD001</td>
                <td><div className="a-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Rolex Datejust</span></div></td>
                <td>Rahul S.</td>
                <td>₹ 4,20,000</td>
                <td><span className="a-badge badge-pending">Pending</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD002</td>
                <td><div className="a-item-cell"><img src="/auctions/home/home-01.png" className="a-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Antique Vase</span></div></td>
                <td>Neha K.</td>
                <td>₹ 60,000</td>
                <td><span className="a-badge badge-scheduled">Shipped</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD003</td>
                <td><div className="a-item-cell"><img src="/auctions/fashion/fashion-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Designer Handbag</span></div></td>
                <td>Amit K.</td>
                <td>₹ 2,10,000</td>
                <td><span className="a-badge badge-sold">Delivered</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD004</td>
                <td><div className="a-item-cell"><img src="/auctions/vehicles/vehicles-01.png" className="a-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Classic Car Model</span></div></td>
                <td>Rahul S.</td>
                <td>₹ 12,50,000</td>
                <td><span className="a-badge badge-sold">Delivered</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD005</td>
                <td><div className="a-item-cell"><img src="/auctions/art/art-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Art Sculpture</span></div></td>
                <td>Priya M.</td>
                <td>₹ 1,10,000</td>
                <td><span className="a-badge badge-pending">Pending</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
