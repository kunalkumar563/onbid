
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function Disputes() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Disputes</h1>
            <p>Handle queries and disputes from buyers or sellers.</p>
          </div>
        </div>
        
        <div className="auct-section" style={{padding: 0}}>
          <div className="a-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="a-tab active">Open (2)</div>
            <div className="a-tab">In Progress (3)</div>
            <div className="a-tab">Resolved (5)</div>
          </div>
          
          <table className="auct-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Raised By</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontWeight: 600}}>#DSP001</td>
                <td><span style={{fontWeight: 600}}>Vintage Watch</span></td>
                <td>Rahul S.</td>
                <td>Item not received</td>
                <td><span className="a-badge badge-inactive">Open</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#DSP002</td>
                <td><span style={{fontWeight: 600}}>Art Painting</span></td>
                <td>Priya M.</td>
                <td>Damaged item</td>
                <td><span className="a-badge badge-scheduled">In Progress</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#DSP003</td>
                <td><span style={{fontWeight: 600}}>Antique Vase</span></td>
                <td>Amit K.</td>
                <td>Authenticity issue</td>
                <td><span className="a-badge badge-inactive">Open</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
              <tr>
                <td style={{fontWeight: 600}}>#DSP004</td>
                <td><span style={{fontWeight: 600}}>Handbag</span></td>
                <td>Neha K.</td>
                <td>Refund request</td>
                <td><span className="a-badge badge-sold">Resolved</span></td>
                <td><button className="a-btn-link">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
