const User = require("../models/User");
const Plan = require("../models/Plan");

const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findUserByEmail = async (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    return null;
  }

  return User.findOne({
    email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
  });
};

const resolvePlanDocument = async (planValue) => {
  const normalizedPlan = String(planValue || "").trim();
  if (!normalizedPlan) {
    return null;
  }

  return Plan.findOne({
    $or: [
      { planCode: normalizedPlan },
      { name: normalizedPlan },
    ],
  });
};

// Get all users (Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user && req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const payload = user.toObject();
    payload.wishlistCount = Array.isArray(payload.wishlist) ? payload.wishlist.length : 0;

    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update user role/status (Admin)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = req.body.role || user.role;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
    user.subscriptionPlan = req.body.subscriptionPlan || user.subscriptionPlan;
    if (req.body.subscriptionPlan) {
      const planDoc = await resolvePlanDocument(req.body.subscriptionPlan);
      const subscriptionStartDate = user.currentSubscription?.startedAt || user.subscriptionStartDate || new Date();
      const subscriptionEndDate = user.currentSubscription?.expiresAt || user.subscriptionEndDate || new Date(subscriptionStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      user.subscriptionStartDate = subscriptionStartDate;
      user.subscriptionEndDate = subscriptionEndDate;
      user.currentSubscription = {
        plan: planDoc?._id || user.currentSubscription?.plan || null,
        planName: planDoc?.name || planDoc?.planCode || req.body.subscriptionPlan,
        status: "active",
        startedAt: subscriptionStartDate,
        expiresAt: subscriptionEndDate,
        autoRenew: Boolean(user.currentSubscription?.autoRenew),
        payment: user.currentSubscription?.payment || null,
      };

      if (planDoc) {
        user.subscriptionHistory.push({
          plan: planDoc._id,
          planName: planDoc.name || planDoc.planCode,
          status: "active",
          startedAt: user.currentSubscription.startedAt,
          endedAt: null,
          payment: user.currentSubscription.payment || null,
        });
      }
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Toggle wishlist (User)
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Assume auth middleware adds req.user
    if (!user) return res.status(404).json({ message: "User not found" });

    const { movieId } = req.body;
    const isSaved = user.wishlist.includes(movieId);

    if (isSaved) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== movieId.toString());
    } else {
      user.wishlist.push(movieId);
    }

    await user.save();
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update profile (User)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body;

    if (name !== undefined) user.name = String(name).trim();

    if (email !== undefined) {
      const emailStr = String(email).trim().toLowerCase();
      // basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailStr)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // ensure email isn't used by another account
      const existing = await findUserByEmail(emailStr);
      if (existing && existing._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }

      user.email = emailStr;
    }

    if (password) {
      // assign and let pre-save hook hash it
      user.password = String(password);
    }

    const updated = await user.save();

    const userObj = updated.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
