import React from "react";

export default function MinimalModal({ children, onClose }) {
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,20,0.35)",
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 9999
      }}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          animation: "fadeIn 0.2s ease"
        }}
      >
        {children}
      </div>
    </div>
  );
}
