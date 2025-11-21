// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import MinimalModal from '../components/MinimalModal';
import PaymentModal from '../components/PaymentModal';
import { Link } from 'react-router-dom';

export default function Dashboard({ user, onLogout }) {
  const [auctions, setAuctions] = useState([]);
  const [view, setView] = useState('buy');
  const [modal, setModal] = useState(null); // bidding modal {auction}
  const [bidValue, setBidValue] = useState('');
  const [paymentAuction, setPaymentAuction] = useState(null); // for buy

  const fetchAuctions = async () => {
    try {
      const { data } = await API.get('/auctions');
      setAuctions(data);
      // if any auction is sold and the current user is the winner, add to watchlist
      if (user) {
        const existing = JSON.parse(localStorage.getItem('watchlist') || '[]');
        let changed = false;
        data.forEach(a => {
          if (a.sold && a.winner && a.winner._id === user.id) {
            if (!existing.find(it => it._id === a._id)) {
              existing.push(a);
              changed = true;
            }
          }
        });
        if (changed) localStorage.setItem('watchlist', JSON.stringify(existing));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  fetchAuctions(); 

  const t = setInterval(() => {
    fetchAuctions();
  }, 10000);

  return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const openBid = (a) => { setModal(a); setBidValue(''); };

  const placeBid = async () => {
    if (!modal) return;
    const min = modal.currentPrice || modal.startingPrice || 0;
    const amount = Number(bidValue);
    if (!amount || isNaN(amount) || amount <= min) {
      alert('Enter an amount higher than current bid.');
      return;
    }
    try {
      await API.post(`/auctions/${modal._id}/bid`, { amount });
      setModal(null);
      fetchAuctions();
    } catch (err) { alert(err.response?.data?.message || 'Bid failed'); }
  };

  const openBuy = (a) => {
    setPaymentAuction(a);
  };

  const handlePaymentSuccess = async (auctionId) => {
    try {
      await API.post(`/auctions/${auctionId}/buy`);
      alert('Payment successful. Purchase confirmed.');
      setPaymentAuction(null);
      fetchAuctions();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    }
  };

  const renderCountdown = (endsAt) => {
    if (!endsAt) return null;
    const end = new Date(endsAt);
    const diff = end - new Date();
    if (diff <= 0) return <div className="tiny muted">Ended</div>;
    const sec = Math.floor(diff / 1000) % 60;
    const min = Math.floor(diff / 1000 / 60) % 60;
    const hrs = Math.floor(diff / 1000 / 60 / 60);
    return <div className="tiny muted">Ends in {hrs}h {min}m {sec}s</div>;
  };

  return (
    <div>
      <div className="topbar">
        <div className="brand-left">Minimal Auction</div>

        <div className="top-actions">
          {user ? <span className="user">{user.name}</span> : null}
          <button className="ghost" onClick={() => setView(v => v === 'buy' ? 'sell' : 'buy')}> {view === 'buy' ? 'Sell' : 'Buy'} </button>

          <Link to="/watchlist" className="ghost">Watchlist</Link>

          <button className="ghost" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="container">
        {view === 'buy' ? (
          <>
            <h2>Live auctions</h2>
            <p className="muted">Place bids, watch items, win auctions.</p>

            <div className="auction-grid">
              {auctions.map(a => (
                <div key={a._id} className="auction-card">
                  <img src={a.image || '/mnt/data/a883b3bf-3103-4a6c-9e04-d591524449d7.png'} alt={a.title} className="product-image" />

                  <div className="product-details">
                    <h3>{a.title}</h3>
                    <p className="product-desc">{a.description}</p>
                    <p className="product-price">₹{(a.currentPrice || a.startingPrice).toLocaleString('en-IN')}</p>
                    {renderCountdown(a.endsAt)}
                    <p className="tiny muted">Seller: {a.seller?.name || 'Seller'}</p>
                    {a.sold && a.winner && <p className="tiny muted">Winner: {a.winner.name}</p>}
                    {a.purchased && <p className="tiny muted">Status: Purchased</p>}
                  </div>

                  <div className="buttons">
                    {/* If auction finished and current user is winner and not purchased => show Buy */}
                    {a.sold && user && a.winner && user.id === a.winner._id && !a.purchased ? (
                      <button className="buy-now" onClick={() => openBuy(a)}>Buy</button>
                    ) : (
                      // If auction still running -> allow bid
                      !a.sold && <button className="buy-now" onClick={() => openBid(a)}>Place Bid</button>
                    )}
                    

                    <button className="add-to-cart" onClick={() => {
                      const existing = JSON.parse(localStorage.getItem('watchlist')||'[]');
                      if (!existing.find(it => it._id === a._id)) {
                        existing.push(a);
                        localStorage.setItem('watchlist', JSON.stringify(existing));
                        alert('Added to watchlist');
                      } else alert('Already in watchlist');
                    }}>Watch</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="sell-panel">
            <h2>Sell</h2>
            <p className="muted">Create a new auction listing.</p>
            <br></br>
            <Link to="/post-auction" className="primary">Post Auction</Link>
          </div>
        )}
      </div>

      {/* Bid modal */}
      {modal && (
        <MinimalModal onClose={() => setModal(null)}>
          <h3>Bid for {modal.title}</h3>
          <p className="muted">Current: ₹{(modal.currentPrice || modal.startingPrice).toLocaleString('en-IN')}</p>
          <input type="number" placeholder="Enter bid amount" value={bidValue} onChange={(e) => setBidValue(e.target.value)} />
          <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:12}}>
            <button className="ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="primary" onClick={placeBid}>Confirm</button>
          </div>
        </MinimalModal>
      )}

      {/* Payment modal */}
      {paymentAuction && (
        <PaymentModal
          auction={paymentAuction}
          onClose={() => setPaymentAuction(null)}
          onSuccess={() => handlePaymentSuccess(paymentAuction._id)}
        />
      )}
    </div>
  );
}
