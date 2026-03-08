const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  role:      { type: String, required: true },
  phone:     { type: String, default: "" },
  email:     { type: String, default: "", lowercase: true },
  dailyWage: { type: Number, required: true, min: 0 },
  project:   { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
  joinDate:  { type: String, default: () => new Date().toISOString().split("T")[0] },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Worker", workerSchema);