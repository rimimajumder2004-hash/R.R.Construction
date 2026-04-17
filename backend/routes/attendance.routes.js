// backend/routes/attendance.routes.js

const express = require("express");
const router = express.Router();
const {
  getByDate,
  getByWorker,
  mark,
  markBulk,
  getMonthlySummary,
} = require("../controllers/attendance.controller");
const { protect } = require("../middleware/auth.middleware");

// GET /api/attendance?date=YYYY-MM-DD
router.get("/", protect, getByDate);

// GET /api/attendance/summary?month=YYYY-MM
router.get("/summary", protect, getMonthlySummary);

// GET /api/attendance/worker/:workerId?month=YYYY-MM
router.get("/worker/:workerId", protect, getByWorker);

// POST /api/attendance  — mark/upsert single record
router.post("/", protect, mark);

// POST /api/attendance/bulk  — mark all workers for a date
router.post("/bulk", protect, markBulk);

module.exports = router;
