require("dotenv").config();
const mongoose = require("mongoose");
const Offer = require("./models/Offer");
const Movie = require("./models/Movie");

const seedOffers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/moviemania";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for offers seed");

    // Remove existing offers
    await Offer.deleteMany({});
    console.log("Removed existing offers");

    const movies = await Movie.find({ type: { $ne: "series" } }).lean();
    if (!movies.length) {
      console.log("⚠️ No movies found in database. Seed movies first before seeding offers.");
      await mongoose.disconnect();
      return;
    }

    const templates = [
      { title: "Super Saver 50% OFF", discountType: "percentage", discountValue: 50 },
      { title: "Special Deal 30% OFF", discountType: "percentage", discountValue: 30 },
      { title: "Weekend Offer 25% OFF", discountType: "percentage", discountValue: 25 },
      { title: "Flat $20 OFF", discountType: "fixed", discountValue: 20 },
      { title: "Blockbuster 15% OFF", discountType: "percentage", discountValue: 15 },
    ];

    const validTillDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const offersData = movies.slice(0, 5).map((movie, index) => {
      const template = templates[index % templates.length];
      const moviePrice = Number(movie.price || 99);
      let finalPrice = moviePrice;
      if (template.discountType === "percentage") {
        finalPrice = moviePrice - (moviePrice * template.discountValue / 100);
      } else {
        finalPrice = moviePrice - template.discountValue;
      }
      finalPrice = Math.max(0, finalPrice);

      return {
        title: template.title,
        movieId: movie._id,
        discountType: template.discountType,
        discountValue: template.discountValue,
        finalPrice,
        validTill: validTillDate,
        isActive: true,
        createdBy: "admin"
      };
    });

    const result = await Offer.insertMany(offersData);
    console.log(`Inserted ${result.length} offer records into database`);

    console.log("Offers seed complete");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error.message || error);
    process.exit(1);
  }
};

seedOffers();
