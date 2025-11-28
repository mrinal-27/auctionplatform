import React, { useEffect, useState } from 'react';

export default function Watchlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('watchlist') || '[]'));
  }, []);

  const remove = (i) => {
    const updated = [...items];
    updated.splice(i, 1);
    setItems(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <h2 className="text-2xl font-semibold text-indigo-600 mb-5">Your Watchlist</h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-10 bg-white shadow rounded-xl">
          Your watchlist is empty.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {items.map((it, idx) => (
            <div key={idx} className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-3 hover:shadow-lg transition">

              <img
                src={it.image}
                alt={it.title}
                className="h-44 w-full object-cover rounded-lg"
              />

              <h3 className="text-lg font-semibold">{it.title}</h3>

              <p className="text-indigo-600 font-bold">
                ₹{(it.currentPrice || it.startingPrice).toLocaleString("en-IN")}
              </p>

              <button
                onClick={() => remove(idx)}
                className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Remove
              </button>

            </div>
          ))}

        </div>
      )}
      
    </div>
  );
}
