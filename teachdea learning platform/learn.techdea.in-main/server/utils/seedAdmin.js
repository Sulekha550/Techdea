import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "TechDea Admin";

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
    }

    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
      }
      console.log(`Admin already exists: ${email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true
    });

    console.log(`Admin created successfully: ${email}`);
  } catch (error) {
    console.error(`Admin seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();