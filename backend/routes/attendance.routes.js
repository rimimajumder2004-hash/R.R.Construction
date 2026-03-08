const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/attendance.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/",                     protect, ctrl.getByDate);
router.get("/summary",              protect, ctrl.getMonthlySummary);
router.get("/worker/:workerId",     protect, ctrl.getByWorker);
router.post("/",                    protect, adminOnly, ctrl.mark);
router.post("/bulk",                protect, adminOnly, ctrl.markBulk);

module.exports = router;