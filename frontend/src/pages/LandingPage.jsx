import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Online Auction Platform</h1>

        <p style={styles.tagline}>
          Bid. Sell. Win. 
        </p>

        <p style={styles.about}>
          Welcome to a real-time auction platform where anyone
          can sell their items and buyers can compete with live bids.  
          Create auctions, watch items, and place bids instantly.
        </p>

        <div style={styles.btnRow}>
          <button style={styles.primary} onClick={() => navigate("/auth?mode=login")}>
            Login
          </button>
          <button style={styles.secondary} onClick={() => navigate("/auth?mode=signup")}>
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fb"
  },
  card: {
    width: "90%",
    maxWidth: "450px",
    background: "white",
    padding: "35px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0px 8px 30px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: "8px",
    color: "#4b4df7",
    fontWeight: 700,
    fontSize: "28px"
  },
  tagline: {
    fontSize: "15px",
    color: "#7a7a86",
    marginBottom: "18px"
  },
  about: {
    fontSize: "14px",
    color: "#676778",
    marginBottom: "24px",
    lineHeight: 1.5
  },
  btnRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px"
  },
  primary: {
    padding: "10px 20px",
    background: "#4b4df7",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  },
  secondary: {
    padding: "10px 20px",
    background: "#e9e9ff",
    color: "#4b4df7",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  }
};
