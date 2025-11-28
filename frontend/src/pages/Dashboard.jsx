import React, { useEffect, useState } from 'react';
import API from '../api';
import MinimalModal from '../components/MinimalModal';
import PaymentModal from '../components/PaymentModal';
import { Link } from 'react-router-dom';

export default function Dashboard({ user, onLogout }) {
  const [auctions, setAuctions] = useState([]);
  const [modal, setModal] = useState(null);
  const [view, setView] = useState('buy');
  const [bidValue, setBidValue] = useState('');
  const [paymentAuction, setPaymentAuction] = useState(null);

  const fetchAuctions = async () => {
    try {
      const { data } = await API.get('/auctions');
      setAuctions(data);
    } catch {}
  };

  useEffect(() => {
    fetchAuctions();
    const t = setInterval(fetchAuctions, 10000);
    return () => clearInterval(t);
  }, []);

  const openBid = (a) => {
    setModal(a);
    setBidValue('');
  };

  const placeBid = async () => {
    if (!modal) return;
    const min = modal.currentPrice || modal.startingPrice;
    const amount = Number(bidValue);

    if (amount <= min) return alert("Bid must be higher.");

    try {
      await API.post(`/auctions/${modal._id}/bid`, { amount });
      setModal(null);
      fetchAuctions();
    } catch {
      alert("Bid failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* NAV */}
      <header className="flex justify-between items-center px-10 py-5 shadow-sm bg-white">
        <h2 className="text-2xl font-bold text-indigo-600">Minimal Auction</h2>

        <div className="flex gap-4 items-center">
          <span className="font-medium text-gray-700">👋 Hey, {user?.name}</span>

          <button 
            onClick={() => setView(view === "buy" ? "sell" : "buy")}
            className="px-4 py-2 rounded-lg border hover:bg-gray-200 transition"
          >
            {view === "buy" ? "Switch to Sell" : "Switch to Buy"}
          </button>

          <Link 
            to="/watchlist"
            className="px-4 py-2 rounded-lg border hover:bg-gray-200 transition"
          >
            Watchlist
          </Link>

          <button 
            onClick={onLogout}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>


      {/* HERO GREETING */}
      <section className="text-center py-12">
        <div className="relative inline-block">
          <div className="absolute -inset-10 bg-purple-200 opacity-40 blur-3xl rounded-full"></div>

          <h1 className="relative text-4xl font-extrabold text-gray-800">
            Welcome back, <span className="text-indigo-600">{user?.name}</span> 👋
          </h1>
        </div>

        <p className="text-gray-600 mt-2">
          Explore auctions, bid live, or sell something today.
        </p>
      </section>


      {/* CONTENT SECTION */}
      <div className="max-w-6xl mx-auto px-6">

        {/* BUY / SELL MODE */}
        {view === "buy" ? (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Live Auctions
            </h3>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {auctions.map(a => (
                <div key={a._id} className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition">

                  <img 
                    src={a.image} 
                    alt={a.title}
                    className="h-44 w-full object-cover rounded-xl"
                  />

                  <h3 className="mt-3 text-lg font-bold text-gray-900">{a.title}</h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {a.description}
                  </p>

                  <p className="text-indigo-600 font-bold text-lg mt-2">
                    ₹ {(a.currentPrice || a.startingPrice)}
                  </p>

                  <div className="flex gap-3 mt-4">
                    {!a.sold ? (
                      <button 
                        className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        onClick={() => openBid(a)}
                      >
                        Bid
                      </button>
                    ) : (
                      a.winner && a.winner._id === user?.id && (
                        <button
                          className="flex-1 px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
                          onClick={() => setPaymentAuction(a)}
                        >
                          Buy Now
                        </button>
                      )
                    )}

                    <button
                      className="flex-1 px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
                      onClick={() => {
                        const saved = JSON.parse(localStorage.getItem("watchlist") || "[]");
                        if (!saved.find(i => i._id === a._id)) {
                          saved.push(a);
                          localStorage.setItem("watchlist", JSON.stringify(saved));
                          alert("Added to watchlist");
                        }
                      }}
                    >
                      Watch
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </>

        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-4">Want to Sell?</h3>
            <Link 
              to="/post-auction"
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Create Auction Listing
            </Link>
          </div>
        )}
      </div>

      {/* BID MODAL */}
      {modal && (
        <MinimalModal onClose={() => setModal(null)}>
          <h2 className="text-xl font-semibold mb-3">Place a bid on: {modal.title}</h2>

          <input
            type="number"
            placeholder="Enter bid amount"
            value={bidValue}
            onChange={(e) => setBidValue(e.target.value)}
            className="input w-full"
          />

          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={() => setModal(null)}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={placeBid}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Confirm Bid
            </button>
          </div>
        </MinimalModal>
      )}

      {/* PAYMENT MODAL */}
      {paymentAuction && (
        <PaymentModal
          auction={paymentAuction}
          onClose={() => setPaymentAuction(null)}
          onSuccess={() => alert("Payment Successful")}
        />
      )}
    </div>
  );
}
