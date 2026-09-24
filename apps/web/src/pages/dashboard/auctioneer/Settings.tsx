
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function Settings() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>Settings</h1>
            <p>Customize your auctioneer experience.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
