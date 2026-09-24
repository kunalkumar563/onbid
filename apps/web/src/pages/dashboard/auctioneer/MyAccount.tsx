
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './AuctioneerDashboard.css';

export default function MyAccount() {
  return (
    <DashboardLayout role="auctioneer">
      <div className="auct-page">
        <div className="auct-header-row">
          <div>
            <h1>My Account</h1>
            <p>Manage your profile and personal information.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
