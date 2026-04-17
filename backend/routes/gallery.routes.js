// backend/routes/galleryRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const path = require("path");

// POST /api/gallery/upload
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  // Build the public URL your frontend can use
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  return res.json({ success: true, imageUrl });
});
const {
  getPublic,
  getAll,
  create,
  remove,
  update,
} = require("../controllers/gallery.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

router.get("/", getPublic);
router.get("/all", protect, getAll);
router.post("/", protect, create);
router.put("/:id", protect, update); // ← add this line
router.delete("/:id", protect, remove);

module.exports = router;
