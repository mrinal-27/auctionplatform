import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* ---- NAVBAR ---- */}
      <header className="flex justify-between items-center px-8 py-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Minimal Auction
        </h1>

        <button
          onClick={() => navigate("/auth?mode=login")}
          className="px-5 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition"
        >
          Login / Signup
        </button>
      </header>

      {/* ---- HERO SECTION ---- */}
      <main className="flex flex-col lg:flex-row items-center justify-center flex-1 gap-10 px-10">

        {/* LEFT TEXT CONTENT */}
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <h2 className="text-4xl font-bold leading-tight">
            Discover, Bid & Win  
            <span className="text-indigo-600"> Unique Items</span>
          </h2>

          <p className="text-gray-600 text-lg">
            A smart auction platform where users compete in real-time,
            sell products, monitor bids, and close deals effortlessly.
          </p>

          <ul className="text-gray-600 space-y-2 text-base">
            <li>🔥 Live & Real-time Bidding</li>
            <li>🔔 Smart Auction Timer</li>
            <li>🛍 Buy, Sell, Watch Favorites</li>
            <li>📦 Instant Purchase After Winning</li>
          </ul>

          <div className="flex gap-4 justify-center lg:justify-start pt-4">
            <button
              onClick={() => navigate("/auth?mode=signup")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow transition"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/auth")}
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Explore Demo
            </button>
          </div>
        </div>

        {/* RIGHT SIDE SHAPE DECOR */}
        <div className="relative">
          <div className="w-[350px] h-[350px] bg-indigo-100 rounded-[30px] rotate-6 shadow-md"></div>
          <div className="absolute inset-0 -rotate-6 bg-purple-200 rounded-[30px] shadow-lg"></div>
        </div>
      </main>
    </div>
  );
}
