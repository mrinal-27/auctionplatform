import { useState } from "react";
import MinimalModal from "./MinimalModal";

export default function PaymentModal({ auction, onClose, onSuccess }) {
  const [mode, setMode] = useState("upi");
  const [loading, setLoading] = useState(false);

  const pay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(auction._id);
      onClose();
    }, 1200);
  };

  return (
    <MinimalModal onClose={onClose}>
      <h2 className="text-lg font-semibold mb-1">Pay for {auction.title}</h2>
      <p className="text-gray-500 mb-4">
        Amount: ₹ {auction.currentPrice || auction.startingPrice}
      </p>

      <div className="flex gap-2">
        <button
          className={`flex-1 px-3 py-2 rounded border ${mode === 'upi' ? "bg-indigo-100 border-indigo-500" : "border-gray-300"}`}
          onClick={() => setMode("upi")}
        >
          UPI
        </button>
        <button
          className={`flex-1 px-3 py-2 rounded border ${mode === 'card' ? "bg-indigo-100 border-indigo-500" : "border-gray-300"}`}
          onClick={() => setMode("card")}
        >
          Card
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <input placeholder="UPI ID" className="input w-full" />
        {mode === "card" && (
          <>
            <input placeholder="Card Number" className="input w-full" />
            <input placeholder="MM/YY" className="input w-full" />
            <input placeholder="CVV" className="input w-full" />
          </>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={pay} disabled={loading}>
          {loading ? "Processing..." : "Pay"}
        </button>
      </div>
    </MinimalModal>
  );
}
