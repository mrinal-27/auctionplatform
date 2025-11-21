// frontend/src/components/PaymentModal.jsx
import React, { useState } from 'react';
import MinimalModal from './MinimalModal';

export default function PaymentModal({ auction, onClose, onSuccess }) {
  const [mode, setMode] = useState('upi'); // 'upi' or 'card'
  const [loading, setLoading] = useState(false);
  const [upi, setUpi] = useState('');
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '' });

  const doPay = async () => {
    // for demo we simply simulate payment success
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(auction._id);
    }, 1200);
  };

  return (
    <MinimalModal onClose={onClose}>
      <h3>Pay for {auction.title}</h3>
      <p className="muted">Amount: ₹{(auction.currentPrice || auction.startingPrice).toLocaleString('en-IN')}</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className="ghost" onClick={() => setMode('upi')} style={{ opacity: mode === 'upi' ? 1 : 0.7 }}>UPI</button>
        <button className="ghost" onClick={() => setMode('card')} style={{ opacity: mode === 'card' ? 1 : 0.7 }}>Card</button>
      </div>

      {mode === 'upi' ? (
        <div>
          <input className="post-form-input" placeholder="UPI ID (e.g. your@upi)" value={upi} onChange={(e)=>setUpi(e.target.value)} />
        </div>
      ) : (
        <div>
          <input className="post-form-input" placeholder="Card number" value={card.number} onChange={(e)=>setCard({...card, number:e.target.value})} />
          <input className="post-form-input" placeholder="Name on card" value={card.name} onChange={(e)=>setCard({...card, name:e.target.value})} />
          <input className="post-form-input" placeholder="MM/YY" value={card.exp} onChange={(e)=>setCard({...card, exp:e.target.value})} />
          <input className="post-form-input" placeholder="CVV" value={card.cvv} onChange={(e)=>setCard({...card, cvv:e.target.value})} />
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:12 }}>
        <button className="ghost" onClick={onClose}>Cancel</button>
        <button className="primary" onClick={doPay} disabled={loading}>{loading ? 'Processing...' : 'Pay'}</button>
      </div>
    </MinimalModal>
  );
}
