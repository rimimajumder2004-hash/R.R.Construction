const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  location:    { type: String, required: true },
  description: { type: String, default: "" },
  startDate:   { type: String, required: true },
  status:      { type: String, enum: ["Planning", "In Progress", "Completed", "On Hold"], default: "Planning" },
  completion:  { type: Number, min: 0, max: 100, default: 0 },
  budget:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);