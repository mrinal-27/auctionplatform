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
      <div className="max-w-xl mx-auto mt-10 text-center p-5 bg-white shadow-md rounded-xl">
        <p className="text-gray-600 font-medium">Please sign in to post an auction.</p>
      </div>
    );
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
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
        image: form.image,
        startingPrice: Number(form.startingPrice),
        endsAt: form.endsAt
      });

      alert("Auction posted successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to create auction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
        Create Auction
      </h2>

      {/* FORM */}
      <form onSubmit={submit} className="bg-white shadow-md rounded-xl p-6 space-y-4">

        <input
          required
          value={form.title}
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input w-full"
        />

        <textarea
          required
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input w-full h-28 resize-none"
        />

        <input
          required
          type="number"
          placeholder="Starting Price (₹)"
          value={form.startingPrice}
          onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
          className="input w-full"
        />

        <label className="text-sm text-gray-600 block">Auction Deadline</label>
        <input
          required
          type="datetime-local"
          value={form.endsAt}
          onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
          className="input w-full"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="block w-full text-sm text-gray-500"
        />

        {form.image && (
          <img
            src={form.image}
            alt="preview"
            className="w-40 rounded-lg mt-2 shadow-md"
          />
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? "Posting..." : "Post Auction"}
          </button>

          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}
