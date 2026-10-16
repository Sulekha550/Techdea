import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester"
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "free", "failed", "refunded"],
      default: "pending"
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 });
enrollmentSchema.index({ student: 1, semester: 1 });

export default mongoose.model("Enrollment", enrollmentSchema);