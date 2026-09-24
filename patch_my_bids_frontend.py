import re

with open('apps/web/src/pages/dashboard/bidder/MyBids.tsx', 'r') as f:
    content = f.read()

new_content = """import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { api } from '../../../services/api/client';
import './BidderDashboard.css';

export default function MyBids() {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const data = await api.get<any[]>('/auctions/my/history');
        setBids(data);
      } catch (err) {
        console.error('Failed to fetch bids:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  const activeBids = bids.filter(b => b.auction.status === 'ACTIVE');
  const wonBids = bids.filter(b => b.auction.status === 'COMPLETED' && b.isWinning);
  const lostBids = bids.filter(b => b.auction.status === 'COMPLETED' && !b.isWinning);
  const outbidBids = activeBids.filter(b => !b.isWinning);

  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>My Bids</h1>
            <p>Track your active bids and bidding history.</p>
          </div>
        </div>
        
        <div className="bidder-section" style={{padding: 0}}>
          <div className="b-tabs" style={{padding: '20px 20px 0', marginBottom: '0'}}>
            <div className="b-tab active">Active Bids ({activeBids.length})</div>
            <div className="b-tab">Outbid ({outbidBids.length})</div>
            <div className="b-tab">Won ({wonBids.length})</div>
            <div className="b-tab">Lost ({lostBids.length})</div>
          </div>

          {loading ? (
             <div style={{padding: '20px'}}>Loading your bid history...</div>
          ) : bids.length === 0 ? (
             <div style={{padding: '20px'}}>You haven't placed any bids yet!</div>
          ) : (
            <table className="bidder-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>My Bid</th>
                  <th>Current Bid</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((b) => (
                  <tr key={b.auction.id}>
                    <td>
                      <div className="b-item-cell">
                        <img 
                          src={b.auction.photos?.[0] || '/auctions/home/home-01.png'} 
                          className="b-item-img"
                          onError={(e) => e.currentTarget.src = '/auctions/home/home-01.png'}
                        />
                        <span style={{fontWeight: 600}}>{b.auction.title}</span>
                      </div>
                    </td>
                    <td>₹ {Number(b.myHighestBid).toLocaleString('en-IN')}</td>
                    <td>₹ {Number(b.auction.currentBid || b.auction.startingPrice).toLocaleString('en-IN')}</td>
                    <td>
                      {b.auction.status === 'ACTIVE' ? (
                        b.isWinning ? (
                           <span className="b-status-highest">Highest Bid</span>
                        ) : (
                           <span className="b-status-outbid">Outbid</span>
                        )
                      ) : (
                        b.isWinning ? (
                           <span className="b-status-won">Won</span>
                        ) : (
                           <span className="b-status-lost">Lost</span>
                        )
                      )}
                    </td>
                    <td>
                      <Link to={`/auctions/${b.auction.id}`}>
                        <button className={b.isWinning ? "b-btn" : "b-btn b-btn-primary"}>
                          {b.auction.status === 'ACTIVE' && !b.isWinning ? 'Bid Again' : 'View'}
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
"""

with open('apps/web/src/pages/dashboard/bidder/MyBids.tsx', 'w') as f:
    f.write(new_content)

