const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { getUsers, getCurrentUser, updateUser, deleteUser, toggleWishlist, updateProfile } = require("../controllers/userController");

const router = express.Router();

router.route("/")
  .get(protect, admin, getUsers);

router.route("/me")
  .get(protect, getCurrentUser);

// Update own profile
router.route("/update-profile")
  .put(protect, updateProfile);

router.route("/:id")
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

router.route("/wishlist")
  .put(protect, toggleWishlist);

module.exports = router;
