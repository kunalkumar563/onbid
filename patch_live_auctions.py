import re

with open('apps/web/src/pages/dashboard/bidder/LiveAuctions.tsx', 'r') as f:
    content = f.read()

new_content = """import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { api } from '../../../services/api/client';
import './BidderDashboard.css';

export default function LiveAuctions() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        // The backend endpoint for active auctions is GET /listings
        const data = await api.get('/listings');
        setAuctions(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error('Failed to fetch auctions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>Live Auctions</h1>
            <p>Bid on unique items from verified sellers around the world.</p>
          </div>
        </div>
        
        <div className="bidder-section" style={{padding: '0 0 30px 0', background: 'transparent', border: 'none', boxShadow: 'none'}}>
          
          {loading ? (
            <div>Loading live auctions...</div>
          ) : auctions.length === 0 ? (
            <div>No live auctions found.</div>
          ) : (
            <div className="b-auction-grid">
              {auctions.map((auction) => (
                <div className="b-auction-card" key={auction.id}>
                  <div className="b-auction-img-wrapper">
                    <img 
                      src={auction.photos?.[0] || '/auctions/home/home-01.png'} 
                      className="b-auction-img" 
                      alt={auction.title}
                      onError={(e) => e.currentTarget.src = '/auctions/home/home-01.png'}
                    />
                    <div className="b-live-badge">LIVE</div>
                    <button className="b-watchlist-btn">♡</button>
                  </div>
                  <div className="b-auction-content">
                    <h3 className="b-auction-title">{auction.title}</h3>
                    <div className="b-auction-details">
                      <div>
                        <div className="b-auction-price">₹ {auction.currentBid > 0 ? auction.currentBid.toLocaleString('en-IN') : auction.startingPrice.toLocaleString('en-IN')}</div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <div className="b-auction-label">Ends soon</div>
                      </div>
                    </div>
                    <Link to={`/auctions/${auction.id}`} style={{textDecoration: 'none'}}>
                      <button className="b-btn b-btn-primary" style={{width: '100%'}}>Place Bid</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
"""

with open('apps/web/src/pages/dashboard/bidder/LiveAuctions.tsx', 'w') as f:
    f.write(new_content)

