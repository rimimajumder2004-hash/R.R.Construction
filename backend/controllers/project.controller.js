const Project = require("../models/Project");

// GET /api/projects
exports.getAll = async (req, res) => {
  const projects = await Project.find().sort("-createdAt");
  res.json({ success: true, count: projects.length, data: projects });
};

// GET /api/projects/:id
exports.getOne = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  res.json({ success: true, data: project });
};

// POST /api/projects
exports.create = async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
};

// PUT /api/projects/:id
exports.update = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  res.json({ success: true, data: project });
};

// DELETE /api/projects/:id
exports.remove = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  res.json({ success: true, message: "Project deleted" });
};