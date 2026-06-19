require("dotenv").config();
const mongoose = require("mongoose");
const Offer = require("./models/Offer");

const offersData = [
  {
    title: "Student Discount",
    description: "Get 50% OFF on premium subscription for students.",
    price: "₹299 / month",
    type: "student",
    discount: 50,
    color: "from-red-500 to-pink-600"
  },
  {
    title: "Family Pack",
    description: "Stream on 5 devices at the same time.",
    price: "₹499 / month",
    type: "family",
    discount: 35,
    color: "from-purple-500 to-indigo-600"
  },
  {
    title: "Yearly Offer",
    description: "Save 40% when you pay yearly subscription.",
    price: "₹2999 / year",
    type: "yearly",
    discount: 40,
    color: "from-blue-500 to-cyan-600"
  },
  {
    title: "Free Trial",
    description: "Enjoy unlimited movies and series for 7 days.",
    price: "FREE for 7 Days",
    type: "trial",
    discount: 100,
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "Festival Offer",
    description: "Special festival discount on MovieMania subscription.",
    price: "₹149 / month",
    type: "festival",
    discount: 75,
    color: "from-yellow-500 to-orange-600"
  },
  {
    title: "Premium Plan",
    description: "Watch in 4K Ultra HD with Dolby sound.",
    price: "₹699 / month",
    type: "premium",
    discount: 0,
    color: "from-gray-700 to-gray-900"
  },
  {
    title: "Basic Plan",
    description: "Standard streaming quality at affordable price.",
    price: "₹299 / month",
    type: "basic",
    discount: 0,
    color: "from-indigo-500 to-blue-600"
  },
  {
    title: "Standard Plan",
    description: "Full HD streaming with 2 simultaneous streams.",
    price: "₹399 / month",
    type: "standard",
    discount: 15,
    color: "from-teal-500 to-cyan-600"
  }
];

const seedOffers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");

    // Remove existing offers
    await Offer.deleteMany({});
    console.log("Removed existing offers");

    // Insert new offers
    const result = await Offer.insertMany(offersData);
    console.log(`Inserted ${result.length} offer records`);

    console.log("Offers seed complete");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedOffers();
