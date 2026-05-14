const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};


exports.admin = (req, res, next) => {
  if (req.user && (req.user.isAdmin === true || req.user.role === "Admin")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};
exports.protectFlow = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ redirect: "/register", message: "Not logged in" });
      }
      if (!req.user.isPaid) {
        return res.status(403).json({ redirect: "/payment", message: "Not paid" });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ redirect: "/register", message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ redirect: "/register", message: "Not authorized, no token" });
  }
};
