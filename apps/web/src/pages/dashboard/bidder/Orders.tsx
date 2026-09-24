
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function Orders() {
  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>Orders</h1>
            <p>Track your purchases and deliveries.</p>
          </div>
        </div>
        
        <div className="bidder-section" style={{padding: 0}}>
          <div className="b-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="b-tab active">All Orders (4)</div>
            <div className="b-tab">To Ship (1)</div>
            <div className="b-tab">Shipped (1)</div>
            <div className="b-tab">Delivered (2)</div>
            <div className="b-tab">Cancelled (0)</div>
          </div>
          
          <table className="bidder-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: 600}}>#ORD001</td>
                <td><div className="b-item-cell"><img src="/auctions/home/home-01.png" className="b-item-img"/><span style={{fontWeight: 600}}>Vintage Watch</span></div></td>
                <td>₹ 2,40,000</td>
                <td><span className="b-badge badge-pending">Pending Payment</span></td>
                <td>Sep 12, 2025</td>
                <td><button className="b-btn b-btn-primary">Pay Now</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD002</td>
                <td><div className="b-item-cell"><img src="/auctions/art/art-01.png" className="b-item-img"/><span style={{fontWeight: 600}}>Antique Painting</span></div></td>
                <td>₹ 1,25,000</td>
                <td><span className="b-badge badge-shipped">Shipped</span></td>
                <td>Aug 28, 2025</td>
                <td><button className="b-btn">Track</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD003</td>
                <td><div className="b-item-cell"><img src="/auctions/fashion/fashion-01.png" className="b-item-img"/><span style={{fontWeight: 600}}>Designer Handbag</span></div></td>
                <td>₹ 2,10,000</td>
                <td><span className="b-badge badge-delivered">Delivered</span></td>
                <td>Aug 10, 2025</td>
                <td><button className="b-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#ORD004</td>
                <td><div className="b-item-cell"><img src="/auctions/home/home-01.png" className="b-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Crystal Chandelier</span></div></td>
                <td>₹ 6,75,000</td>
                <td><span className="b-badge badge-delivered">Delivered</span></td>
                <td>Jul 22, 2025</td>
                <td><button className="b-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
