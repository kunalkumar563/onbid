
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function Schedule() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Schedule</h1>
            <p>Upcoming Auctions</p>
          </div>
          <div style={{background: 'white', padding: '8px 15px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '14px', fontWeight: 600}}>
            📅 Sep 24, 2025 - Sep 30, 2025 ▾
          </div>
        </div>
        
        <div className="auct-section" style={{padding: 0}}>
          <table className="auct-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/art/art-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Modern Art Painting</span></div></td>
                <td>Sep 26, 2025</td>
                <td>Sep 29, 2025</td>
                <td><span className="a-badge badge-scheduled">Scheduled</span></td>
                <td><button className="a-btn-link">Edit</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Diamond Necklace</span></div></td>
                <td>Sep 27, 2025</td>
                <td>Sep 29, 2025</td>
                <td><span className="a-badge badge-scheduled">Scheduled</span></td>
                <td><button className="a-btn-link">Edit</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/vehicles/vehicles-01.png" className="a-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Classic Car Model</span></div></td>
                <td>Oct 01, 2025</td>
                <td>Oct 05, 2025</td>
                <td><span className="a-badge badge-scheduled">Scheduled</span></td>
                <td><button className="a-btn-link">Edit</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/home/home-01.png" className="a-item-img" onError={(e)=>e.currentTarget.src='/auctions/art/art-01.png'}/><span style={{fontWeight: 600}}>Antique Clock</span></div></td>
                <td>Oct 03, 2025</td>
                <td>Oct 07, 2025</td>
                <td><span className="a-badge badge-scheduled">Scheduled</span></td>
                <td><button className="a-btn-link">Edit</button></td>
              </tr>
              <tr>
                <td><div className="a-item-cell"><img src="/auctions/jewelry/jewelry-01.png" className="a-item-img"/><span style={{fontWeight: 600}}>Emerald Ring</span></div></td>
                <td>Oct 05, 2025</td>
                <td>Oct 10, 2025</td>
                <td><span className="a-badge badge-scheduled">Scheduled</span></td>
                <td><button className="a-btn-link">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
