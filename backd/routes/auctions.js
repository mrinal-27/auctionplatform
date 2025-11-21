// backd/routes/auctions.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Auction = require("../model/Auction");
const User = require("../model/User");

const router = express.Router();

// Auth middleware (same as before)
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token" });
  const token = header.replace("Bearer ", "");
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Helper: finalize ended auctions (called on GET)
async function finalizeEndedAuctions() {
  const now = new Date();
  // find auctions ended and not yet sold
  const ended = await Auction.find({ endsAt: { $lte: now }, sold: false }).populate('bids.user');
  for (const a of ended) {
    if (a.bids && a.bids.length > 0) {
      // last bid is highest (we ensure bids are pushed in order)
      const highestBid = a.bids[a.bids.length - 1];
      a.winner = highestBid.user ? highestBid.user._id : null;
    } else {
      a.winner = null; // no bids
    }
    a.sold = true;
    await a.save();
  }
}

// Get all auctions (also finalizes ended ones)
router.get("/", async (req, res) => {
  try {
    await finalizeEndedAuctions();
    const auctions = await Auction.find().populate("seller", "name email").populate("bids.user", "name email").populate("winner", "name email").sort({ createdAt: -1 });
    res.json(auctions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create auction (protected)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, image, startingPrice, endsAt } = req.body;
    const auction = await Auction.create({
      title,
      description,
      image,
      startingPrice,
      currentPrice: startingPrice,
      seller: req.userId,
      endsAt: endsAt ? new Date(endsAt) : undefined,
    });
    res.json(auction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// place a bid (protected)
router.post("/:id/bid", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const a = await Auction.findById(req.params.id);
    if (!a) return res.status(404).json({ message: "Auction not found" });

    // check if auction ended
    if (a.endsAt && new Date() > new Date(a.endsAt)) {
      return res.status(400).json({ message: "Auction already ended" });
    }

    const min = a.currentPrice || a.startingPrice || 0;
    if (amount <= min) return res.status(400).json({ message: "Bid must be higher than current price" });

    a.bids.push({ user: req.userId, amount });
    a.currentPrice = amount;
    await a.save();

    const populated = await Auction.findById(a._id).populate("bids.user", "name email");
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// buy endpoint (protected) - winner can call this to mark purchased
router.post("/:id/buy", auth, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate("winner", "name email");
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (!auction.sold) return res.status(400).json({ message: "Auction not finished yet" });

    if (!auction.winner) return res.status(400).json({ message: "No winner for this auction" });

    // only the winner can buy
    if (String(auction.winner._id) !== String(req.userId)) {
      return res.status(403).json({ message: "Only the winning bidder can purchase" });
    }

    if (auction.purchased) return res.status(400).json({ message: "Already purchased" });

    // Here you would do payment verification. We'll simulate success.
    auction.purchased = true;
    await auction.save();

    res.json({ message: "Purchase successful", auction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
// delete auction (only seller)
router.delete("/:id", auth, async (req, res) => {
  try {
    const a = await Auction.findById(req.params.id);
    if (!a) return res.status(404).json({ message: "Auction not found" });

    // only seller can delete
    if (String(a.seller) !== String(req.userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await a.deleteOne();
    res.json({ message: "Auction deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

