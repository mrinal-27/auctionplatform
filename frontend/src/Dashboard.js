import React, { useState } from "react";
import "./index.css";

const Dashboard = ({ auctions }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bids, setBids] = useState({}); // Track bids for each auction item

  const filteredAuctions = auctions.filter((auction) =>
    auction.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (auction) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, auction];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const placeBid = (auctionId) => {
    const newBid = prompt("Enter your bid amount:");
    if (newBid) {
      const bidAmount = parseFloat(newBid);
      if (!isNaN(bidAmount) && bidAmount > (bids[auctionId] || auctions.find(a => a.id === auctionId).price)) {
        setBids({ ...bids, [auctionId]: bidAmount });
      } else {
        alert("Bid must be higher than the current price.");
      }
    }
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Browse!!!!</p>

      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <div className="auction-grid">
        {filteredAuctions.length > 0 ? (
          filteredAuctions.map((auction) => (
            <div key={auction.id} className="auction-card">
              <img src={auction.image} alt={auction.title} className="product-image" />
              <div className="product-details">
                <h3>{auction.title}</h3>
                <p className="product-desc">{auction.description}</p>
                <strong className="product-price">
                  ₹{(bids[auction.id] || auction.price).toLocaleString("en-IN")}
                </strong>
              </div>
              <div className="buttons">
                <button className="buy-now">Buy Now</button>
                <button className="add-to-cart" onClick={() => addToCart(auction)}>
                  Add to Cart
                </button>
                <button className="bid-now" onClick={() => placeBid(auction.id)}>
                  Bid
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
