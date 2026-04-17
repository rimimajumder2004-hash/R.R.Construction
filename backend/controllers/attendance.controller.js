// backend/controllers/attendance_controller.js

const Attendance = require("../models/Attendance");
const Worker = require("../models/Worker");

// GET /api/attendance?date=YYYY-MM-DD
exports.getByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date)
      return res
        .status(400)
        .json({ success: false, message: "date query param required" });

    const records = await Attendance.find({ date }).populate(
      "worker",
      "name role dailyWage phone",
    );
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/attendance/worker/:workerId?month=YYYY-MM
exports.getByWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { month } = req.query;
    const filter = { worker: workerId };
    if (month) filter.date = { $regex: `^${month}` };

    const records = await Attendance.find(filter).sort("date");
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/attendance  — mark/upsert single record
exports.mark = async (req, res) => {
  try {
    const { worker, date, status, notes } = req.body;
    if (!worker || !date || !status)
      return res
        .status(400)
        .json({ success: false, message: "worker, date, status required" });

    const record = await Attendance.findOneAndUpdate(
      { worker, date },
      { worker, date, status, notes: notes || "" },
      { upsert: true, new: true, runValidators: true },
    ).populate("worker", "name role");

    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/attendance/bulk  — mark all workers for a date
exports.markBulk = async (req, res) => {
  try {
    const { date, status } = req.body;
    if (!date || !status)
      return res
        .status(400)
        .json({ success: false, message: "date and status required" });

    const workers = await Worker.find({ isActive: true }).select("_id");
    if (workers.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No active workers found" });

    const ops = workers.map((w) => ({
      updateOne: {
        filter: { worker: w._id, date },
        update: { $set: { worker: w._id, date, status } },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);
    res.json({
      success: true,
      message: `All ${workers.length} workers marked as ${status}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/attendance/summary?month=YYYY-MM
exports.getMonthlySummary = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month)
      return res
        .status(400)
        .json({ success: false, message: "month param required" });

    const records = await Attendance.find({
      date: { $regex: `^${month}` },
    }).populate("worker", "name role dailyWage");

    const summary = {};
    records.forEach((r) => {
      const wid = r.worker._id.toString();
      if (!summary[wid]) {
        summary[wid] = {
          worker: r.worker,
          present: 0,
          halfDay: 0,
          absent: 0,
          leave: 0,
        };
      }
      if (r.status === "Present") summary[wid].present++;
      if (r.status === "Half Day") summary[wid].halfDay++;
      if (r.status === "Absent") summary[wid].absent++;
      if (r.status === "Leave") summary[wid].leave++;
    });

    res.json({ success: true, data: Object.values(summary) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
