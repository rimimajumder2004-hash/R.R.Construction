const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
  date:   { type: String, required: true },  // "YYYY-MM-DD"
  status: { type: String, enum: ["Present", "Absent", "Half Day", "Leave"], required: true },
  notes:  { type: String, default: "" },
}, { timestamps: true });

// Unique attendance per worker per date
attendanceSchema.index({ worker: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);