const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/inquiry.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.post("/",      ctrl.submit);                       // Public
router.get("/",       protect, ctrl.getAll);              // Admin
router.put("/:id",    protect, adminOnly, ctrl.updateStatus);
router.delete("/:id", protect, adminOnly, ctrl.remove);

module.exports = router;