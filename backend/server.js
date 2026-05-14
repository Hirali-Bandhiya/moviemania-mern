const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const movieRoutes = require("./routes/movieRoutes");
const seriesRoutes = require("./routes/seriesRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const offersRoutes = require("./routes/offersRoutes");
const plansRoutes = require("./routes/plansRoutes");

// Test route
app.get("/", (req, res) => {
  res.send("MovieMania Backend Running 🚀");
});

// Dev-only debug routes (do not enable in production)
if (process.env.NODE_ENV !== "production") {
  const User = require("./models/User");

  // List all users (emails only) to help debug forgot-password lookups
  app.get("/api/debug/users", async (req, res) => {
    try {
      const users = await User.find({}).select("name email");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Error fetching users", error: err.message });
    }
  });
}

// API Routes
app.use("/api/movies", movieRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/offers", offersRoutes);
app.use("/api/plans", plansRoutes);

const Plan = require("./models/Plan");
const WatchHistory = require("./models/WatchHistory");

// Connect MongoDB and start server only after successful DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    return Promise.all([Plan.init(), WatchHistory.init()]);
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err.message || err);
    process.exit(1);
  });