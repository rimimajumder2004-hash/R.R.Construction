const Worker = require("../models/Worker");

// GET /api/workers
exports.getAll = async (req, res) => {
  const { project } = req.query;
  const filter = project ? { project } : {};
  const workers = await Worker.find(filter).populate("project", "name location").sort("-createdAt");
  res.json({ success: true, count: workers.length, data: workers });
};

// GET /api/workers/:id
exports.getOne = async (req, res) => {
  const worker = await Worker.findById(req.params.id).populate("project", "name location");
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });
  res.json({ success: true, data: worker });
};

// POST /api/workers
exports.create = async (req, res) => {
  const worker = await Worker.create(req.body);
  res.status(201).json({ success: true, data: await worker.populate("project", "name") });
};

// PUT /api/workers/:id
exports.update = async (req, res) => {
  const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate("project", "name location");
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });
  res.json({ success: true, data: worker });
};

// DELETE /api/workers/:id
exports.remove = async (req, res) => {
  const worker = await Worker.findByIdAndDelete(req.params.id);
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });
  res.json({ success: true, message: "Worker deleted" });
};