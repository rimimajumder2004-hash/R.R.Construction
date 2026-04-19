const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.cookies?.cms_token;

  // Fallback to httpOnly cookie
  if (!token && req.cookies?.cms_token) {
    token = req.cookies.cms_token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized — no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
  next();
};

module.exports = { protect, adminOnly };
