require("dotenv").config();
const mongoose = require("mongoose");
const Payment = require("./models/Payment");
const User = require("./models/User");

const seedPayments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");

    // Get users to link payments to
    const users = await User.find().limit(5);
    
    if (users.length === 0) {
      console.log("No users found. Please create users first.");
      await mongoose.disconnect();
      return;
    }

    // Remove existing payments
    await Payment.deleteMany({});
    console.log("Removed existing payments");

    // Create sample payments
    const paymentsData = [];
    const plans = ["Basic", "Standard", "Premium", "Family", "Student", "Yearly"];
    const amounts = { Basic: 299, Standard: 399, Premium: 699, Family: 499, Student: 199, Yearly: 2999 };
    const currencies = ["INR"];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const plansForUser = Math.floor(Math.random() * 2) + 1; // 1-2 plans per user

      for (let j = 0; j < plansForUser; j++) {
        const plan = plans[Math.floor(Math.random() * plans.length)];
        const amount = amounts[plan];
        
        paymentsData.push({
          user: user._id,
          orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          paymentId: `pay_${Math.random().toString(36).substr(2, 12)}`,
          amount: amount,
          currency: "INR",
          plan: plan,
          status: Math.random() > 0.1 ? "Success" : "Failed", // 90% success rate
          paymentMethod: ["Razorpay", "Credit Card", "UPI"][Math.floor(Math.random() * 3)],
          description: `${plan} plan subscription payment`,
          transactionDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Last 90 days
          subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        });
      }
    }

    // Insert payments
    const result = await Payment.insertMany(paymentsData);
    console.log(`Inserted ${result.length} payment records`);

    // Display summary
    const paymentsSummary = await Payment.countDocuments();
    const successPayments = await Payment.countDocuments({ status: "Success" });
    const failedPayments = await Payment.countDocuments({ status: "Failed" });

    console.log("\n=== Payment Summary ===");
    console.log(`Total payments: ${paymentsSummary}`);
    console.log(`Successful: ${successPayments}`);
    console.log(`Failed: ${failedPayments}`);

    console.log("\nPayments seed complete");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedPayments();
