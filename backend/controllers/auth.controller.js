const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper — used by login & register
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // Fix 1: token expires

// Cookie options kept in one place so login/logout always match
const COOKIE_OPTS = {
  httpOnly: true, // Fix 2: JS can't read this cookie
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms — matches JWT expiry
};

// @route  POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password)))
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });

  // Set token as httpOnly cookie — no longer sent in the JSON body
  res.cookie("cms_token", generateToken(user._id), COOKIE_OPTS);

  return res.status(200).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// @route  GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @route  POST /api/auth/register  (admin only in production)
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists)
    return res
      .status(400)
      .json({ success: false, message: "Email already registered" });

  const user = await User.create({
    name,
    email,
    password,
    role: role || "viewer",
  });

  // Same cookie approach as login
  res.cookie("cms_token", generateToken(user._id), COOKIE_OPTS);

  return res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// @route  POST /api/auth/logout        Fix 3: logout clears the cookie
exports.logout = (req, res) => {
  res.clearCookie("cms_token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ success: true, message: "Logged out" });
};
