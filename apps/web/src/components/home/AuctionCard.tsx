type AuctionCardProps = {
  image: string;
  category: string;
  title: string;
  bid: string;
  bids: number;
  time: string;
  status?: "LIVE" | "ENDING SOON" | "UPCOMING";
};

function AuctionCard({
  image,
  category,
  title,
  bid,
  bids,
  time,
  status = "LIVE",
}: AuctionCardProps) {
  return (
    <article className="auction-card">
      <div className="auction-card-image">
        <img
          src={image}
          alt={title}
          loading="lazy"
        />

        <div className="auction-card-status">
          <span />
          {status}
        </div>

        <button
          type="button"
          className="auction-card-heart"
          aria-label="Add to wishlist"
        >
          ♡
        </button>
      </div>

      <div className="auction-card-body">
        <span className="auction-card-category">
          {category}
        </span>

        <h3>{title}</h3>

        <div className="auction-card-meta">
          <div>
            <small>Current bid</small>
            <strong>{bid}</strong>
          </div>

          <div>
            <small>Bids</small>
            <strong>{bids}</strong>
          </div>

          <div>
            <small>Ends</small>
            <strong>{time}</strong>
          </div>
        </div>

        <button
          type="button"
          className="auction-card-button"
        >
          View Auction
          <span>↗</span>
        </button>
      </div>
    </article>
  );
}

export default AuctionCard;