import React, { useState, useEffect } from "react";
import "./index.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1); // Remove the selected item
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  return (
    <div className="container">
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-grid">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-card">
              <img src={item.image} alt={item.title} className="product-image1" />
              <div className="product-details">
                <h3>{item.title}</h3>
                <p className="product-desc">{item.description}</p>
                <strong className="product-price">₹{item.price.toLocaleString("en-IN")}</strong>
                <br/>
                <button className="remove-btn" onClick={() => removeFromCart(index)}>
                  Remove from Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
