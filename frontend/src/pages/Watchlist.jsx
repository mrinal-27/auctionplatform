import React, { useEffect, useState } from 'react';

export default function Watchlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('watchlist') || '[]'));
  }, []);

  const remove = (i) => {
    const cp = [...items];
    cp.splice(i, 1);
    setItems(cp);
    localStorage.setItem('watchlist', JSON.stringify(cp));
  };

  return (
    <div className="container">
      <h2>Your Watchlist</h2>

      {items.length === 0 ? (
        <p className="muted">Your watchlist is empty.</p>
      ) : (
        <div className="auction-grid">
          {items.map((it, idx) => (
            <div className="auction-card" key={idx}>
              <img src={it.image || '/mnt/data/a883b3bf-3103-4a6c-9e04-d591524449d7.png'} alt={it.title} className="product-image" />
              <h3>{it.title}</h3>
              <p className="product-price">₹{(it.currentPrice || it.startingPrice).toLocaleString('en-IN')}</p>
              <div style={{ marginTop: 8 }}>
                <button className="remove-btn" onClick={() => remove(idx)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
