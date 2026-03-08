const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  title:     { type: String, required: true },
  project:   { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
  phase:     { type: String, enum: ["Foundation", "Structure", "Finishing", "Completed", "Ongoing"], default: "Ongoing" },
  imageUrl:  { type: String, required: true },
  caption:   { type: String, default: "" },
  isPublic:  { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Gallery", gallerySchema);