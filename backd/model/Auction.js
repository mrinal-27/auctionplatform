// backd/model/Auction.js
const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  createdAt: { type: Date, default: Date.now }
});

const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  startingPrice: Number,
  currentPrice: Number,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bids: [bidSchema],
  createdAt: { type: Date, default: Date.now },
  endsAt: { type: Date },
  // new fields
  sold: { type: Boolean, default: false },        // true when auction auto-closed and assigned
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  purchased: { type: Boolean, default: false }    // true after winner buys
});

module.exports = mongoose.model('Auction', auctionSchema);
