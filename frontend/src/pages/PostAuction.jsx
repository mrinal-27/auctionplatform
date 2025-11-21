import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function PostAuction({ user }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    startingPrice: "",
    endsAt: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="container">
        <p>Please sign in to post an auction.</p>
      </div>
    );
  }

  // Convert image to base64
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result }); // Base64 saved here
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auctions", {
        title: form.title,
        description: form.description,
        image: form.image,     // base64 stored in DB
        startingPrice: Number(form.startingPrice),
        endsAt: form.endsAt
      });

      alert("Auction posted");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 500 }}>
          <h2>Create Auction</h2>

          <form className="post-form" onSubmit={submit}>
            <input
              required
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              required
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input
              required
              type="number"
              placeholder="Starting Price (₹)"
              value={form.startingPrice}
              onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
            />

            <label style={{ fontSize: 14, color: "#666" }}>Auction deadline</label>

            <input
              required
              type="datetime-local"
              value={form.endsAt}
              onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
            />

            <input type="file" accept="image/*" onChange={handleFile} />

            {form.image && (
              <img
                src={form.image}
                alt="preview"
                style={{ width: 220, borderRadius: 8 }}
              />
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="primary" type="submit" disabled={loading}>
                {loading ? "Posting..." : "Post Auction"}
              </button>
              <button
                type="button"
                className="ghost"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
