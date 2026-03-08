const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  worker:       { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
  month:        { type: String, required: true },   // "YYYY-MM"
  daysPresent:  { type: Number, default: 0 },
  daysHalfDay:  { type: Number, default: 0 },
  daysAbsent:   { type: Number, default: 0 },
  dailyWage:    { type: Number, required: true },
  grossSalary:  { type: Number, default: 0 },
  deductions:   { type: Number, default: 0 },
  netSalary:    { type: Number, default: 0 },
  paymentStatus:{ type: String, enum: ["Pending", "Paid"], default: "Pending" },
  paidDate:     { type: Date, default: null },
  notes:        { type: String, default: "" },
}, { timestamps: true });

salarySchema.index({ worker: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Salary", salarySchema);