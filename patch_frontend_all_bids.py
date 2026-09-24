import re

with open('apps/web/src/pages/dashboard/bidder/MyBids.tsx', 'r') as f:
    content = f.read()

old_logic = """  const activeBids = bids.filter(b => b.auction.status === 'ACTIVE');
  const wonBids = bids.filter(b => b.auction.status === 'COMPLETED' && b.isWinning);
  const lostBids = bids.filter(b => b.auction.status === 'COMPLETED' && !b.isWinning);
  const outbidBids = activeBids.filter(b => !b.isWinning);"""

new_logic = """  const activeBids = bids.filter(b => b.auction.status === 'ACTIVE');
  const wonBids = bids.filter(b => ['COMPLETED', 'DELIVERED', 'CLOSED'].includes(b.auction.status) && b.isWinning);
  const lostBids = bids.filter(b => ['COMPLETED', 'DELIVERED', 'CLOSED'].includes(b.auction.status) && !b.isWinning);
  const outbidBids = activeBids.filter(b => !b.isWinning);"""

content = content.replace(old_logic, new_logic)

old_table = """                {bids.map((b) => (
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
                ))}"""

new_table = """                {bids.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="b-item-cell">
                        <img 
                          src={b.auction.photos?.[0] || '/auctions/home/home-01.png'} 
                          className="b-item-img"
                          onError={(e) => e.currentTarget.src = '/auctions/home/home-01.png'}
                        />
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                          <span style={{fontWeight: 600}}>{b.auction.title}</span>
                          <span style={{fontSize: '11px', color: '#666'}}>
                            {new Date(b.createdAt).toLocaleString('en-IN', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>₹ {Number(b.myBidAmount).toLocaleString('en-IN')}</td>
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
                ))}"""

content = content.replace(old_table, new_table)

with open('apps/web/src/pages/dashboard/bidder/MyBids.tsx', 'w') as f:
    f.write(content)

