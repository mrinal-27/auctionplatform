import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./Signup";
import Signin from "./Signin";
import Dashboard from "./Dashboard";
import PostAuction from "./PostAuction";
import Cart from "./Cart";

const App = () => {
  const [auctions, setAuctions] = useState([
    { id: 1, title: "iPhone 14 Pro", description: "Brand new, 128GB", price: 58000, image: "/images/iphone 14 pro.jpeg" },
    { id: 2, title: "Gaming Laptop", description: "RTX 3060, 16GB RAM", price: 99999, image: "/images/Gaming Laptop.jpeg" },
  ]);

  const addAuction = (newAuction) => {
    setAuctions([...auctions, { ...newAuction, id: auctions.length + 1 }]);
  };

  return (
    <Router>
      <div className="navbar">
        <h1>Auction App</h1>
        <nav>
          <ul>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/signin">Signin</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/post-auction">Post Auction</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </nav>
      </div>
      <p>Every Thing You Desire</p>
      
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard auctions={auctions} />} />
        <Route path="/post-auction" element={<PostAuction addAuction={addAuction} />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;
