
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AdminDashboard.css';

export default function Users() {
  return (
    <DashboardLayout role="admin">
      <div className="admin-page">
        <div className="admin-header-row">
          <div>
            <h1>User Management</h1>
            <p>Manage platform users, roles and permissions.</p>
          </div>
        </div>
        
        <div className="admin-section" style={{padding: 0}}>
          <div className="ad-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="ad-tab active">All Users (356)</div>
            <div className="ad-tab">Bidders (184)</div>
            <div className="ad-tab">Sellers (87)</div>
            <div className="ad-tab">Auctioneers (12)</div>
            <div className="ad-tab">Verifiers (8)</div>
            <div className="ad-tab">Admins (5)</div>
          </div>
          
          <div style={{padding: '15px 20px', borderBottom: '1px solid #f0ebf5', display: 'flex', gap: '15px'}}>
            <input type="text" className="ad-btn" placeholder="🔍 Search users by name, email..." style={{flex: 1, cursor: 'text'}} />
            <select className="ad-btn"><option>All Roles ▾</option></select>
            <select className="ad-btn"><option>All Status ▾</option></select>
            <button className="ad-btn ad-btn-primary">+ Add User</button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="ad-item-cell"><div className="ad-avatar" style={{background:'#4b2ab5'}}>RS</div><div><div style={{fontWeight: 600, color: '#1a1025'}}>Rahul Sharma</div><div style={{fontSize: '11px', color: '#888'}}>rahul.s@example.com</div></div></div></td>
                <td><span className="badge-role-bidder">Bidder</span></td>
                <td>Sep 12, 2025</td>
                <td><span className="ad-badge badge-active">Active</span></td>
                <td><button className="ad-btn-link" style={{fontSize: '20px', color: '#666'}}>⋮</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><div className="ad-avatar" style={{background:'#2e7d32'}}>PM</div><div><div style={{fontWeight: 600, color: '#1a1025'}}>Priya Mehta</div><div style={{fontSize: '11px', color: '#888'}}>priya.m@example.com</div></div></div></td>
                <td><span className="badge-role-seller">Seller</span></td>
                <td>Sep 10, 2025</td>
                <td><span className="ad-badge badge-active">Active</span></td>
                <td><button className="ad-btn-link" style={{fontSize: '20px', color: '#666'}}>⋮</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><div className="ad-avatar" style={{background:'#ff9800'}}>AK</div><div><div style={{fontWeight: 600, color: '#1a1025'}}>Amit Kumar</div><div style={{fontSize: '11px', color: '#888'}}>amit.k@example.com</div></div></div></td>
                <td><span className="badge-role-auctioneer">Auctioneer</span></td>
                <td>Sep 08, 2025</td>
                <td><span className="ad-badge badge-active">Active</span></td>
                <td><button className="ad-btn-link" style={{fontSize: '20px', color: '#666'}}>⋮</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><div className="ad-avatar" style={{background:'#ab47bc'}}>NK</div><div><div style={{fontWeight: 600, color: '#1a1025'}}>Neha Khandelwal</div><div style={{fontSize: '11px', color: '#888'}}>neha.k@example.com</div></div></div></td>
                <td><span className="badge-role-verifier">Verifier</span></td>
                <td>Sep 05, 2025</td>
                <td><span className="ad-badge badge-active">Active</span></td>
                <td><button className="ad-btn-link" style={{fontSize: '20px', color: '#666'}}>⋮</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><div className="ad-avatar" style={{background:'#d32f2f'}}>KT</div><div><div style={{fontWeight: 600, color: '#1a1025'}}>Karan Thakur</div><div style={{fontSize: '11px', color: '#888'}}>karan.t@example.com</div></div></div></td>
                <td><span className="badge-role-bidder">Bidder</span></td>
                <td>Sep 01, 2025</td>
                <td><span className="ad-badge badge-suspended">Suspended</span></td>
                <td><button className="ad-btn-link" style={{fontSize: '20px', color: '#666'}}>⋮</button></td>
              </tr>
              <tr>
                <td><div className="ad-item-cell"><div className="ad-avatar" style={{background:'#2e7d32'}}>SR</div><div><div style={{fontWeight: 600, color: '#1a1025'}}>Sneha R.</div><div style={{fontSize: '11px', color: '#888'}}>sneha.r@example.com</div></div></div></td>
                <td><span className="badge-role-seller">Seller</span></td>
                <td>Aug 28, 2025</td>
                <td><span className="ad-badge badge-active">Active</span></td>
                <td><button className="ad-btn-link" style={{fontSize: '20px', color: '#666'}}>⋮</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
