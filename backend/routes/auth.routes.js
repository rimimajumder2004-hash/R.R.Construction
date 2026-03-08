const express = require("express");
const router = express.Router();
const { login, getMe, register } = require("../controllers/auth.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.post("/login",    login);
router.get("/me",        protect, getMe);
router.post("/register", protect, adminOnly, register);  // Only admins can create users

module.exports = router;