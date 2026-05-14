require("dotenv").config();
const mongoose = require("mongoose");
const Plan = require("./models/Plan");

const plansData = [
  {
    planCode: "basic",
    name: "Basic",
    description: "Good video quality in 720p. Watch on any phone, tablet, computer or TV.",
    pricing: {
      monthly: 499,
      yearly: null,
      currency: "INR",
    },
    features: [
      "Access to unlimited movies and TV shows",
      "Watch on 1 supported device at a time",
      "Watch in HD (720p)",
      "Downloads on 1 supported device",
    ],
    limits: {
      quality: "HD",
      screens: 1,
      downloads: 1,
    },
    active: true,
    popular: false,
    sortOrder: 1,
  },
  {
    planCode: "family",
    name: "Family",
    description: "Great video quality in 1080p. Best for small screens and laptops.",
    pricing: {
      monthly: 1499,
      yearly: null,
      currency: "INR",
    },
    features: [
      "Access to unlimited movies and TV shows",
      "Watch on 2 supported devices at a time",
      "Watch in Full HD (1080p)",
      "Downloads on 2 supported devices",
      "Ad-free experience",
    ],
    limits: {
      quality: "Full HD",
      screens: 2,
      downloads: 2,
    },
    active: true,
    popular: true,
    sortOrder: 2,
  },
  {
    planCode: "premium",
    name: "Premium",
    description: "Our best video quality in 4K+HDR. The ultimate experience.",
    pricing: {
      monthly: 999,
      yearly: null,
      currency: "INR",
    },
    features: [
      "Access to unlimited movies and TV shows",
      "Watch on 4 supported devices at a time",
      "Watch in Ultra HD (4K) and HDR",
      "Downloads on 6 supported devices",
      "Ad-free experience",
      "Spatial audio",
    ],
    limits: {
      quality: "4K",
      screens: 4,
      downloads: 6,
    },
    active: true,
    popular: false,
    sortOrder: 3,
  },
];

async function seedPlans() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/moviemania");
    console.log("Connected to MongoDB");

    await Plan.deleteMany({});
    console.log("Cleared existing plans");

    const inserted = await Plan.insertMany(plansData);
    console.log(`Inserted ${inserted.length} plans into database`);

    console.log("\n📊 Plans Added:");
    inserted.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name} (${plan.planCode})`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding plans:", error.message || error);
    process.exit(1);
  }
}

seedPlans();