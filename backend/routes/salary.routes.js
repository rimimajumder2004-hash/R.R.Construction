const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/salary.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/",           protect, ctrl.getByMonth);
router.post("/generate",  protect, adminOnly, ctrl.generate);
router.put("/:id/pay",    protect, adminOnly, ctrl.markPaid);
router.put("/:id/unpay",  protect, adminOnly, ctrl.markUnpaid);

module.exports = router;