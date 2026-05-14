const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

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
  const sendEmail = require("./utils/sendEmail");

  // List all users (emails only) to help debug forgot-password lookups
  app.get("/api/debug/users", async (req, res) => {
    try {
      const users = await User.find({}).select("name email");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Error fetching users", error: err.message });
    }
  });

  // Send a test email using current env config. Query param: ?to=you@example.com
  app.get("/api/debug/send-test-email", async (req, res) => {
    const to = String(req.query.to || "").trim();
    if (!to) {
      return res.status(400).json({ message: "Provide 'to' query param, e.g. /api/debug/send-test-email?to=you@example.com" });
    }

    try {
      await sendEmail({
        to,
        subject: "MovieMania Test Email",
        html: `<p>This is a test email from MovieMania backend. If you received this, SMTP is configured correctly.</p>`,
      });

      res.json({ message: `Test email sent to ${to}` });
    } catch (err) {
      res.status(500).json({ message: "Failed to send test email", error: err.message });
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

// MongoDB Connection with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`🔄 Connecting to MongoDB (Attempt ${retries + 1}/${maxRetries})...`);
      await mongoose.connect(process.env.MONGO_URI, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      });

      await Promise.all([Plan.init(), WatchHistory.init()]);
      
      console.log("✅ MongoDB Connected successfully!");
      console.log(`📍 Connected to: ${process.env.MONGO_URI}`);
      
      // Start server after successful DB connection
      app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log("🎬 MovieMania Backend is ready!");
      });
      
      return;
    } catch (err) {
      retries++;
      console.log(`❌ Connection failed: ${err.message}`);
      
      if (retries < maxRetries) {
        const waitTime = 2000 * retries; // Exponential backoff
        console.log(`⏳ Retrying in ${waitTime / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.error("❌ Failed to connect to MongoDB after multiple attempts");
  console.error("⚠️  Make sure MongoDB is running on localhost:27017");
  process.exit(1);
};

connectDB();
