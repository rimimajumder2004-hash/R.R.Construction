// gallery.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/gallery.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/",       ctrl.getPublic);                  // Public
router.get("/all",    protect, ctrl.getAll);             // Admin
router.post("/",      protect, adminOnly, ctrl.create);
router.delete("/:id", protect, adminOnly, ctrl.remove);

module.exports = router;