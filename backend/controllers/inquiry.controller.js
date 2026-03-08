const Inquiry = require("../models/Inquiry");

// POST /api/inquiries  — public submission
exports.submit = async (req, res) => {
  const inquiry = await Inquiry.create(req.body);
  res.status(201).json({ success: true, message: "Inquiry submitted successfully", data: inquiry });
};

// GET /api/inquiries  — admin only
exports.getAll = async (req, res) => {
  const { status, type } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type)   filter.type   = type;

  const inquiries = await Inquiry.find(filter).sort("-createdAt");
  const unreadCount = await Inquiry.countDocuments({ status: "New" });
  res.json({ success: true, count: inquiries.length, unreadCount, data: inquiries });
};

// PUT /api/inquiries/:id  — update status
exports.updateStatus = async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
  res.json({ success: true, data: inquiry });
};

// DELETE /api/inquiries/:id
exports.remove = async (req, res) => {
  await Inquiry.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Inquiry deleted" });
};