const Salary = require("../models/Salary");
const Worker = require("../models/Worker");
const Attendance = require("../models/Attendance");

// POST /api/salary/generate  — auto-generate salary from attendance
exports.generate = async (req, res) => {
  const { month } = req.body;
  if (!month)
    return res
      .status(400)
      .json({ success: false, message: "month required (YYYY-MM)" });

  const workers = await Worker.find({ isActive: true });

  for (const worker of workers) {
    const records = await Attendance.find({
      worker: worker._id,
      date: { $regex: `^${month}` },
    });

    const daysPresent = records.filter((r) => r.status === "Present").length;
    const daysHalfDay = records.filter((r) => r.status === "Half Day").length;
    const daysAbsent = records.filter((r) => r.status === "Absent").length;

    const effectiveDays = daysPresent + daysHalfDay * 0.5;
    const grossSalary = effectiveDays * worker.dailyWage;
    const netSalary = grossSalary;

    await Salary.findOneAndUpdate(
      { worker: worker._id, month },
      {
        worker: worker._id,
        month,
        daysPresent,
        daysHalfDay,
        daysAbsent,
        dailyWage: worker.dailyWage,
        grossSalary,
        netSalary,
      },
      { upsert: true, new: true },
    );
  }

  // Re-fetch with full populate so the response always has worker details
  const populated = await Salary.find({ month }).populate(
    "worker",
    "name role phone dailyWage",
  );
  const totalPayroll = populated.reduce((sum, r) => sum + r.netSalary, 0);
  const totalPaid = populated
    .filter((r) => r.paymentStatus === "Paid")
    .reduce((sum, r) => sum + r.netSalary, 0);

  res.json({
    success: true,
    count: populated.length,
    totalPayroll,
    totalPaid,
    data: populated,
  });
};

// GET /api/salary?month=YYYY-MM
exports.getByMonth = async (req, res) => {
  const { month } = req.query;
  if (!month)
    return res
      .status(400)
      .json({ success: false, message: "month param required" });

  const records = await Salary.find({ month }).populate(
    "worker",
    "name role phone dailyWage",
  );
  const totalPayroll = records.reduce((sum, r) => sum + r.netSalary, 0);
  const totalPaid = records
    .filter((r) => r.paymentStatus === "Paid")
    .reduce((sum, r) => sum + r.netSalary, 0);

  res.json({
    success: true,
    count: records.length,
    totalPayroll,
    totalPaid,
    data: records,
  });
};

// PUT /api/salary/:id/pay  — mark as paid
exports.markPaid = async (req, res) => {
  const salary = await Salary.findByIdAndUpdate(
    req.params.id,
    { paymentStatus: "Paid", paidDate: new Date() },
    { new: true },
  ).populate("worker", "name");

  if (!salary)
    return res
      .status(404)
      .json({ success: false, message: "Record not found" });
  res.json({ success: true, data: salary });
};

// PUT /api/salary/:id/unpay
exports.markUnpaid = async (req, res) => {
  const salary = await Salary.findByIdAndUpdate(
    req.params.id,
    { paymentStatus: "Pending", paidDate: null },
    { new: true },
  ).populate("worker", "name");

  if (!salary)
    return res
      .status(404)
      .json({ success: false, message: "Record not found" });
  res.json({ success: true, data: salary });
};
