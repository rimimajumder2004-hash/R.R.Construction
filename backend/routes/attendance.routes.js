// backend/routes/galleryRoutes.js

const express = require("express");
const router = express.Router();
const {
  getPublic,
  getAll,
  create,
  remove,
  update,
} = require("../controllers/galleryController");
const { protect } = require("../middleware/auth");

router.get("/", getPublic);
router.get("/all", protect, getAll);
router.post("/", protect, create);
router.put("/:id", protect, update); // ← add this line
router.delete("/:id", protect, remove);

module.exports = router;
