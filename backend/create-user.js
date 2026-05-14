const mongoose = require("mongoose");
const User = require("./models/User");
const crypto = require("crypto");
require("dotenv").config();

const createTestUser = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if test user already exists
    const existingUser = await User.findOne({ email: "user@moviemania.com" });
    if (existingUser) {
      console.log("⚠️  Test user already exists!");
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      mongoose.connection.close();
      return;
    }

    // Generate unique referral code
    const referralCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    // Create test user
    const testUser = await User.create({
      name: "Test User",
      email: "user@moviemania.com",
      password: "user123", // Will be hashed automatically
      role: "User",
      referralCode: referralCode
    });

    console.log("✅ Test user created successfully!");
    console.log("📧 Email: user@moviemania.com");
    console.log("🔐 Password: user123");
    console.log("\n💡 You can now login with these credentials on the user side.");

    mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error creating test user:", error.message);
    process.exit(1);
  }
};

createTestUser();
