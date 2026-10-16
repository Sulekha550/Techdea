
import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    studentName: {
      type: String,
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    courseTitle: {
      type: String,
      required: true
    },

    issueDate: {
      type: Date,
      default: Date.now
    },

    completionPercentage: {
      type: Number,
      default: 100
    },

    grade: {
      type: String,
      default: "Distinction"
    },

    verificationUrl: {
      type: String,
      default: ""
    },

    isValid: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Unique certificate per student-course combination
certificateSchema.index(
  { student: 1, course: 1 },
  { unique: true }
);

export default mongoose.model("Certificate", certificateSchema);


