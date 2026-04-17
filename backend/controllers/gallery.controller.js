const Gallery = require("../models/Gallery");

// GET /api/gallery  (public - only isPublic:true)
exports.getPublic = async (req, res) => {
  const images = await Gallery.find({ isPublic: true })
    .populate("project", "name")
    .sort("-createdAt");
  res.json({ success: true, count: images.length, data: images });
};

// GET /api/gallery/all  (admin - all images)
exports.getAll = async (req, res) => {
  const images = await Gallery.find()
    .populate("project", "name")
    .sort("-createdAt");
  res.json({ success: true, count: images.length, data: images });
};

// POST /api/gallery
exports.create = async (req, res) => {
  const image = await Gallery.create(req.body);
  res
    .status(201)
    .json({ success: true, data: await image.populate("project", "name") });
};

// DELETE /api/gallery/:id
exports.remove = async (req, res) => {
  const image = await Gallery.findByIdAndDelete(req.params.id);
  if (!image)
    return res.status(404).json({ success: false, message: "Image not found" });
  res.json({ success: true, message: "Image deleted" });
};

// ✅ Add this to galleryController.js
exports.update = async (req, res) => {
  const payload = {
    ...req.body,
    project: req.body.project === "" ? null : req.body.project,
  };
  const image = await Gallery.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  }).populate("project", "name");
  if (!image)
    return res.status(404).json({ success: false, message: "Image not found" });
  res.json({ success: true, data: image });
};
