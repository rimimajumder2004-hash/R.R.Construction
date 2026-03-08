const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/project.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/",       ctrl.getAll);            // Public — project portfolio
router.get("/:id",    ctrl.getOne);            // Public
router.post("/",      protect, adminOnly, ctrl.create);
router.put("/:id",    protect, adminOnly, ctrl.update);
router.delete("/:id", protect, adminOnly, ctrl.remove);

module.exports = router;