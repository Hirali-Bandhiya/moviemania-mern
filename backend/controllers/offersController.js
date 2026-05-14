const Offer = require("../models/Offer");
const Movie = require("../models/Movie");

const getFutureExpiryDate = (validTill) => {
  const parsedDate = new Date(validTill);

  if (!validTill || Number.isNaN(parsedDate.getTime())) {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  if (parsedDate.getTime() <= Date.now()) {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  return parsedDate;
};

const seedDefaultOffersIfNeeded = async () => {
  const now = new Date();
  const activeVisibleCount = await Offer.countDocuments({
    isActive: true,
    validTill: { $gt: now },
  });

  if (activeVisibleCount >= 5) {
    return;
  }

  const movies = await Movie.find({ type: { $ne: "series" } })
    .sort({ createdAt: 1 })
    .lean();

  if (!movies.length) {
    return;
  }

  const seedTemplates = [
    { title: "50% OFF", discountType: "percentage", discountValue: 50 },
    { title: "30% OFF", discountType: "percentage", discountValue: 30 },
    { title: "25% OFF", discountType: "percentage", discountValue: 25 },
    { title: "20% OFF", discountType: "percentage", discountValue: 20 },
    { title: "15% OFF", discountType: "percentage", discountValue: 15 },
  ];

  const existingMovieIds = new Set(
    (await Offer.find({
      isActive: true,
      validTill: { $gt: now },
    }).select("movieId").lean()).map((offer) => String(offer.movieId))
  );

  const offersToCreate = movies
    .filter((movie) => !existingMovieIds.has(String(movie._id)))
    .slice(0, Math.max(0, 5 - activeVisibleCount))
    .map((movie, index) => {
      const template = seedTemplates[(activeVisibleCount + index) % seedTemplates.length];
      const moviePrice = Number(movie.price || 99);
      const finalPrice = Math.max(0, moviePrice - (moviePrice * template.discountValue / 100));

      return {
        title: template.title,
        movieId: movie._id,
        discountType: template.discountType,
        discountValue: template.discountValue,
        finalPrice,
        isActive: true,
        validTill: new Date(Date.now() + (30 + index) * 24 * 60 * 60 * 1000),
        createdBy: "system",
      };
    });

  if (offersToCreate.length > 0) {
    await Offer.insertMany(offersToCreate);
  }
};

// Get all active offers (Public)
exports.getAllOffers = async (req, res) => {
  try {
    await seedDefaultOffersIfNeeded();

    const currentDate = new Date();
    const offers = await Offer.find({
      isActive: true,
      validTill: { $gt: currentDate }
    })
      .populate("movieId", "title image genre _id")
      .sort({ discountValue: -1 });

    console.log("Offers fetched:", offers.length);
    
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all offers (Admin)
exports.getAdminOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate("movieId", "title image banner genre")
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get offer by ID
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate("movieId", "title image banner genre");
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new offer
exports.createOffer = async (req, res) => {
  try {
    const { title, movieId, discountType, discountValue, validTill, isActive } = req.body;

    // Removed manual validation to rely on Mongoose schema validation
    // if (!title || !movieId || !discountType || discountValue === undefined || !validTill) {
    //   return res.status(400).json({ message: "Required fields missing" });
    // }

    // Fetch movie to calculate finalPrice
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Default movie price if not exists
    const moviePrice = movie.price || 99; // Assume some default price or get from movie
    
    let finalPrice = moviePrice;
    if (discountType === "percentage") {
      finalPrice = moviePrice - (moviePrice * discountValue / 100);
    } else if (discountType === "fixed") {
      finalPrice = moviePrice - discountValue;
    }
    
    // Ensure finalPrice is not negative
    finalPrice = Math.max(0, finalPrice);

    const newOffer = await Offer.create({
      title,
      movieId,
      discountType,
      discountValue,
      finalPrice,
      validTill: getFutureExpiryDate(validTill),
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user ? req.user.name : "admin"
    });

    const populatedOffer = await Offer.findById(newOffer._id).populate("movieId", "title image banner genre");
    res.status(201).json(populatedOffer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update offer
exports.updateOffer = async (req, res) => {
  try {
    const { title, movieId, discountType, discountValue, validTill, isActive } = req.body;

    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Recalculate price if discount changed
    let finalPrice = offer.finalPrice;
    if (movieId || discountType || discountValue !== undefined) {
       const mId = movieId || offer.movieId;
       const movie = await Movie.findById(mId);
       const moviePrice = movie ? (movie.price || 99) : 99;
       
       const dType = discountType || offer.discountType;
       const dVal = discountValue !== undefined ? discountValue : offer.discountValue;

       if (dType === "percentage") {
         finalPrice = moviePrice - (moviePrice * dVal / 100);
       } else if (dType === "fixed") {
         finalPrice = moviePrice - dVal;
       }
       finalPrice = Math.max(0, finalPrice);
    }

    offer.title = title || offer.title;
    if (movieId) offer.movieId = movieId;
    if (discountType) offer.discountType = discountType;
    if (discountValue !== undefined) offer.discountValue = discountValue;
    if (validTill) {
      offer.validTill = getFutureExpiryDate(validTill);
    }
    if (isActive !== undefined) offer.isActive = isActive;
    offer.finalPrice = finalPrice;

    await offer.save();

    const updatedOffer = await Offer.findById(offer._id).populate("movieId", "title image banner genre");
    res.json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete offer (Soft delete)
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    offer.isActive = false;
    await offer.save();

    res.json({ message: "Offer deleted successfully (soft delete)", offer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
