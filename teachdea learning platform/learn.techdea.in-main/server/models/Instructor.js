import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    title: { type: String, default: "Senior Instructor & Mentor" },
    bio: { type: String, default: "" },
    expertise: [{ type: String }],
    status: {
      type: String,
      enum: ["approved", "pending", "suspended"],
      default: "approved"
    },
    rating: { type: Number, default: 4.9, min: 1, max: 5 },
    totalStudents: { type: Number, default: 0 },
    assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
  },
  { timestamps: true }
);

instructorSchema.index({ email: 1, status: 1 });

export default mongoose.model("Instructor", instructorSchema);
