const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, default: "" },
  subject:     { type: String, default: "General Inquiry" },
  message:     { type: String, required: true },
  projectType: { type: String, default: "" },
  budget:      { type: String, default: "" },
  type:        { type: String, enum: ["contact", "quotation"], default: "contact" },
  status:      { type: String, enum: ["New", "Read", "Replied", "Closed"], default: "New" },
}, { timestamps: true });

module.exports = mongoose.model("Inquiry", inquirySchema);