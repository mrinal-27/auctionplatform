require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Connect DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/auctions", require("./routes/auctions"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
