const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User       = require("../models/User");
const Project    = require("../models/Project");
const Worker     = require("../models/Worker");
const Attendance = require("../models/Attendance");
const Gallery    = require("../models/Gallery");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB for seeding...");

  // Clear existing
  await Promise.all([
    User.deleteMany(), Project.deleteMany(), Worker.deleteMany(),
    Attendance.deleteMany(), Gallery.deleteMany(),
  ]);

  // Admin user — pass plain password, the User model's pre-save hook will hash it automatically
  await User.create({ name: "Super Admin", email: "admin@rrconstruction.in", password: "admin123", role: "admin" });

  // Projects
  const projects = await Project.insertMany([
    { name: "Skyline Tower", location: "Mumbai, MH", description: "40-floor commercial skyscraper with modern facade", startDate: "2024-01-15", status: "In Progress", completion: 62, budget: 5200000 },
    { name: "Green Valley Residences", location: "Pune, MH", description: "Eco-friendly residential complex, 200 units", startDate: "2023-08-01", status: "Completed", completion: 100, budget: 3100000 },
    { name: "Metro Bridge Overpass", location: "Nashik, MH", description: "4-lane flyover bridge connecting industrial zones", startDate: "2024-03-10", status: "Planning", completion: 18, budget: 8700000 },
    { name: "Harbor Warehouse Complex", location: "Mumbai Port", description: "Industrial storage facility near dockyard", startDate: "2024-05-20", status: "In Progress", completion: 34, budget: 1900000 },
  ]);

  // Workers
  const workers = await Worker.insertMany([
    { name: "Ravi Sharma",  role: "Civil Engineer",  phone: "9876543210", email: "ravi@cms.com",   dailyWage: 1200, project: projects[0]._id, joinDate: "2023-12-01" },
    { name: "Suresh Patil", role: "Site Foreman",    phone: "9812345678", email: "suresh@cms.com", dailyWage: 950,  project: projects[0]._id, joinDate: "2024-01-20" },
    { name: "Anita Desai",  role: "Safety Officer",  phone: "9823456789", email: "anita@cms.com",  dailyWage: 1100, project: projects[1]._id, joinDate: "2023-09-01" },
    { name: "Manoj Kumar",  role: "Mason",            phone: "9834567890", email: "manoj@cms.com",  dailyWage: 700,  project: projects[2]._id, joinDate: "2024-02-15" },
    { name: "Priya Singh",  role: "Architect",        phone: "9845678901", email: "priya@cms.com",  dailyWage: 1500, project: projects[3]._id, joinDate: "2024-04-01" },
    { name: "Deepak Rao",   role: "Electrician",      phone: "9856789012", email: "deepak@cms.com", dailyWage: 850,  project: projects[0]._id, joinDate: "2024-01-10" },
  ]);

  // Attendance (today)
  const today = new Date().toISOString().split("T")[0];
  const statuses = ["Present", "Present", "Absent", "Half Day", "Present", "Leave"];
  await Attendance.insertMany(workers.map((w, i) => ({ worker: w._id, date: today, status: statuses[i] })));

  // Gallery
  await Gallery.insertMany([
    { title: "Skyline Tower Foundation", project: projects[0]._id, phase: "Foundation", imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&fit=crop" },
    { title: "Steel Framework Level 12", project: projects[0]._id, phase: "Structure",  imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&fit=crop" },
    { title: "Green Valley Site View",   project: projects[1]._id, phase: "Completed",  imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&fit=crop" },
    { title: "Metro Bridge Piling",      project: projects[2]._id, phase: "Foundation", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&fit=crop" },
    { title: "Harbor Warehouse Frame",   project: projects[3]._id, phase: "Structure",  imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&fit=crop" },
  ]);

  console.log("✅ Seed complete!");
  process.exit(0);
};

seed().catch(e => { console.error(e); process.exit(1); });
