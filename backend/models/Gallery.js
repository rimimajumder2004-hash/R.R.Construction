const mongoose = require("mongoose");
const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  phase: { type: String, default: "Ongoing" },
  caption: { type: String },
  isPublic: { type: Boolean, default: true },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
    required: false,
  },
});
module.exports = mongoose.model("Gallery", gallerySchema);
