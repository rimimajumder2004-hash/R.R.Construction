const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/worker.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/",       protect, ctrl.getAll);
router.get("/:id",    protect, ctrl.getOne);
router.post("/",      protect, adminOnly, ctrl.create);
router.put("/:id",    protect, adminOnly, ctrl.update);
router.delete("/:id", protect, adminOnly, ctrl.remove);

module.exports = router;