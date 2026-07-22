/**
 * scripts/seed.ts
 * --------------------------------------------------------------
 * Populates a fresh database with sample data so you can explore
 * (and demo in a viva) the app without manually creating dozens
 * of records.
 *
 * Run with:  npm run seed
 * --------------------------------------------------------------
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Student from "../src/models/Student";
import Worker from "../src/models/Worker";
import Admin from "../src/models/Admin";
import Hostel from "../src/models/Hostel";
import Category from "../src/models/Category";
import Complaint from "../src/models/Complaint";
import { COMPLAINT_CATEGORIES } from "../src/lib/constants";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local first.");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB. Clearing old sample data...");

  await Promise.all([
    Student.deleteMany({}),
    Worker.deleteMany({}),
    Admin.deleteMany({}),
    Hostel.deleteMany({}),
    Category.deleteMany({}),
    Complaint.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash("Password@123", 10);

  // ---- Hostels ----
  await Hostel.create([
    {
      name: "Yamuna Girls Hostel", type: "floor-based", totalFloors: 7,
      floors: Array.from({ length: 7 }, (_, i) => ({
        floorNumber: i + 1, isMess: i + 1 === 2,
        rooms: i + 1 === 2 ? [] : [{ roomNumber: `${i + 1}01`, capacity: 5 }, { roomNumber: `${i + 1}02`, capacity: 5 }],
      })),
    },
    {
      name: "Dhauladhar Boys Hostel", type: "floor-based", totalFloors: 7,
      floors: Array.from({ length: 7 }, (_, i) => ({
        floorNumber: i + 1, isMess: i + 1 === 2,
        rooms: i + 1 === 2 ? [] : [{ roomNumber: `${i + 1}01`, capacity: 5 }, { roomNumber: `${i + 1}02`, capacity: 5 }],
      })),
    },
    {
      name: "Shivalik Boys Hostel", type: "block-based",
      blocks: ["A", "B", "C", "D"].map((name) => ({
        name, rooms: [{ roomNumber: `${name}101`, capacity: 3 }, { roomNumber: `${name}102`, capacity: 3 }],
      })),
    },
  ]);

  // ---- Categories ----
  await Category.insertMany(COMPLAINT_CATEGORIES.map((name) => ({ name, isActive: true })));

  // ---- Admin ----
  const admin = await Admin.create({ name: "College Admin", email: "admin@nitdelhi.ac.in", password: hashedPassword });

  // ---- Workers ----
  const [electrician, plumber] = await Worker.create([
    { name: "Ramesh Kumar", email: "ramesh.worker@gmail.com", password: hashedPassword, specialization: "Electrician" },
    { name: "Suresh Yadav", email: "suresh.worker@gmail.com", password: hashedPassword, specialization: "Plumber" },
  ]);

  // ---- Students ----
  const [asha, rohit] = await Student.create([
    {
      name: "Asha Verma", email: "asha.verma@nitdelhi.ac.in", password: hashedPassword,
      hostel: "Yamuna Girls Hostel", floor: 3, roomNumber: "301", isVerified: true,
    },
    {
      name: "Rohit Sharma", email: "rohit.sharma@nitdelhi.ac.in", password: hashedPassword,
      hostel: "Shivalik Boys Hostel", block: "B", roomNumber: "B102", isVerified: true,
    },
  ]);

  // ---- Sample Complaints ----
  await Complaint.create([
    {
      student: asha._id, hostel: "Yamuna Girls Hostel", floor: 3, roomNumber: "301",
      category: "Fan", title: "Ceiling fan making noise",
      description: "The ceiling fan makes a loud rattling noise and wobbles when switched on.",
      status: "In Progress", assignedWorker: electrician._id,
      timeline: [
        { status: "Pending", note: "Complaint submitted by student", timestamp: new Date(Date.now() - 3 * 86400000) },
        { status: "Assigned", note: "Assigned to Ramesh Kumar", timestamp: new Date(Date.now() - 2 * 86400000) },
        { status: "In Progress", note: "Technician visited, ordering spare part", timestamp: new Date(Date.now() - 86400000) },
      ],
    },
    {
      student: rohit._id, hostel: "Shivalik Boys Hostel", block: "B", roomNumber: "B102",
      category: "Plumbing", title: "Leaking bathroom tap",
      description: "The wash basin tap in the common washroom has been leaking continuously since morning.",
      status: "Pending",
      timeline: [{ status: "Pending", note: "Complaint submitted by student", timestamp: new Date() }],
    },
  ]);

  console.log("\nSample logins (password for all: Password@123):");
console.log("  Admin:   admin@nitdelhi.ac.in");
console.log("  Worker:  ramesh.kumar@gmail.com / suresh.yadav@gmail.com");
console.log("  Student: asha.verma@nitdelhi.ac.in / rohit.sharma@nitdelhi.ac.in");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
