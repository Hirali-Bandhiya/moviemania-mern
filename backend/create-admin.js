const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/User");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/moviemania";

const createAdminUser = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    // Update an existing admin account if one already exists, otherwise create it.
    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { isAdmin: true }, { role: "Admin" }],
    });

    if (existingAdmin) {
      existingAdmin.name = "Admin";
      existingAdmin.email = adminEmail;
      existingAdmin.password = adminPassword;
      existingAdmin.role = "Admin";
      existingAdmin.isAdmin = true;

      await existingAdmin.save();

      console.log("✅ Admin user updated successfully!");
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log("🔐 Password: admin123");
      console.log("💡 Existing admin account was refreshed instead of duplicated.");

      mongoose.connection.close();
      console.log("✅ Database connection closed");
      return;
    }


    // Create admin user
    const adminUser = await User.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword, // Will be hashed automatically
      role: "Admin",
      isAdmin: true
    });
    console.log("✅ Admin user created successfully!");
    console.log(`📧 Email: ${adminUser.email}`);
    console.log("🔐 Password: admin123");
    console.log("\n💡 You can now login with these credentials on the admin page.");

    mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
};

createAdminUser();
