import React, { useState } from "react";

const PostAuction = ({ addAuction }) => {
  const [auctionData, setAuctionData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });

  const handleChange = (e) => {
    setAuctionData({ ...auctionData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAuctionData({ ...auctionData, image: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!auctionData.title || !auctionData.description || !auctionData.price) return;

    addAuction(auctionData);
    setAuctionData({ title: "", description: "", price: "", image: null });
  };

  return (
    <div className="post-auction">
      <h2>Post Auction</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {auctionData.image && <img src={auctionData.image} alt="Preview" style={{ width: "200px" }} />}
        <input type="text" name="title" placeholder="Auction Title" value={auctionData.title} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={auctionData.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Starting Price" value={auctionData.price} onChange={handleChange} required />
        <button type="submit">Post Auction</button>
      </form>
    </div>
  );
};

export default PostAuction;
