
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function Users() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Users & Bidders</h1>
            <p>View and manage registered users and active bidders.</p>
          </div>
        </div>
        
        <div className="auct-section" style={{padding: 0}}>
          <div className="a-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="a-tab active">All Users (256)</div>
            <div className="a-tab">Bidders (184)</div>
            <div className="a-tab">Sellers (42)</div>
          </div>
          
          <div style={{padding: '15px 20px', borderBottom: '1px solid #f0ebf5', display: 'flex', gap: '15px'}}>
            <input type="text" className="a-btn" placeholder="🔍 Search users..." style={{flex: 1, cursor: 'text'}} />
            <select className="a-btn"><option>Filter ▾</option></select>
          </div>

          <table className="auct-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined On</th>
                <th>Total Bids</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="a-item-cell"><div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#4b2ab5',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:'12px'}}>RS</div><span style={{fontWeight: 600}}>Rahul Sharma</span></div></td>
                <td>Bidder</td>
                <td>Sep 12, 2025</td>
                <td>24</td>
                <td><span className="a-badge badge-active">Active</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#ab47bc',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:'12px'}}>PM</div><span style={{fontWeight: 600}}>Priya Mehta</span></div></td>
                <td>Bidder</td>
                <td>Sep 10, 2025</td>
                <td>18</td>
                <td><span className="a-badge badge-active">Active</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#e0e0e0',color:'#333',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:'12px'}}>AK</div><span style={{fontWeight: 600}}>Amit Kumar</span></div></td>
                <td>Bidder</td>
                <td>Sep 05, 2025</td>
                <td>12</td>
                <td><span className="a-badge badge-inactive">Inactive</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#2e7d32',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:'12px'}}>NK</div><span style={{fontWeight: 600}}>Neha Khandelwal</span></div></td>
                <td>Seller</td>
                <td>Aug 31, 2025</td>
                <td>31</td>
                <td><span className="a-badge badge-active">Active</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#1976d2',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:'12px'}}>KT</div><span style={{fontWeight: 600}}>Karan Thakur</span></div></td>
                <td>Bidder</td>
                <td>Aug 01, 2025</td>
                <td>5</td>
                <td><span className="a-badge badge-active">Active</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
