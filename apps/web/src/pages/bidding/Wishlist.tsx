import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useWishlist } from '../../context/WishlistContext';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('All Items');

  const getFilteredItems = () => {
    switch (activeTab) {
      case 'Live Now': return wishlist.filter(item => item.label === 'LIVE');
      case 'Ending Soon': return wishlist.filter(item => item.urgent);
      default: return wishlist;
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <DashboardLayout role="bidder">
      <div className="wishlist-page">
        <div className="wl-breadcrumb">
          ONBID / Bidder Workspace / <strong>Watchlist</strong>
        </div>

        <div className="wl-header-row">
          <div className="wl-header-title">
            <span className="wl-header-kicker">SAVED AUCTIONS</span>
            <h1>Your watchlist.</h1>
            <p>Keep track of the auctions that interest you and never miss an opportunity.</p>
          </div>
          <div className="wl-quote">
            "Extraordinary items
            <br />
            find extraordinary people."
            <span>— ONBID</span>
          </div>
        </div>

        <div className="wl-stats">
          <div className="wl-stat-card">
            <div className="wl-stat-icon">♡</div>
            <div className="wl-stat-info">
              <strong>{wishlist.length}</strong>
              <span>Saved Items</span>
            </div>
          </div>
          <div className="wl-stat-card">
            <div className="wl-stat-icon">🔨</div>
            <div className="wl-stat-info">
              <strong>{wishlist.filter(i => i.label === 'LIVE').length}</strong>
              <span>Live Now</span>
            </div>
          </div>
          <div className="wl-stat-card">
            <div className="wl-stat-icon">🕒</div>
            <div className="wl-stat-info">
              <strong>{wishlist.filter(i => i.urgent).length}</strong>
              <span>Ending Soon (24h)</span>
            </div>
          </div>
          <div className="wl-stat-card">
            <div className="wl-stat-icon">📦</div>
            <div className="wl-stat-info">
              <strong>0</strong>
              <span>Already Ended</span>
            </div>
          </div>
        </div>

        <div className="wl-controls">
          <div className="wl-tabs">
            {['All Items', 'Live Now', 'Ending Soon'].map(tab => (
              <div 
                key={tab}
                className={`wl-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          <div className="wl-filters">
            <select className="wl-select">
              <option>↑↓ Recently Saved</option>
            </select>
            <div className="wl-view-toggles">
              <button className="wl-view-btn active">☷</button>
              <button className="wl-view-btn">☰</button>
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div style={{padding: '50px', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px solid #eee'}}>
            <h3 style={{color: '#888'}}>Your watchlist is empty</h3>
            <p>Start browsing categories to find extraordinary items!</p>
          </div>
        ) : (
          <div className="wl-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="wl-item-card">
                <div className="wl-item-image">
                  <img src={item.image} alt={item.title} onError={(e) => { e.currentTarget.src = '/auctions/art/art-01.png'; }} />
                  {item.label && (
                    <div className={`wl-badge ${item.label === 'LIVE' ? 'live' : 'ending'}`}>
                      {item.label}
                    </div>
                  )}
                  <button className="wl-heart filled" onClick={() => removeFromWishlist(item.id)}>♥</button>
                </div>
                <div className="wl-item-content">
                  <h3>{item.title}</h3>
                  <span className="wl-item-cat">{item.category}</span>
                  <div className="wl-item-bid-row">
                    <div>
                      <small>Current Bid</small>
                      <strong>{item.price}</strong>
                    </div>
                    <div className={`wl-time ${item.urgent ? 'urgent' : ''}`}>
                      {item.time}
                    </div>
                  </div>
                  <div className="wl-item-actions">
                    <button className="wl-btn wl-btn-view">View Details</button>
                    <button className="wl-btn wl-btn-remove" onClick={() => removeFromWishlist(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
