import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: { type: String, default: "" },
    studentEmail: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now },
    marks: { type: Number, default: 0 },
    feedback: { type: String, default: "" },
    status: {
      type: String,
      enum: ["submitted", "graded", "resubmit_required"],
      default: "submitted"
    }
  },
  { timestamps: true }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    courseTitle: { type: String, default: "" },
    description: { type: String, default: "" },
    dueDate: { type: Date },
    maxMarks: { type: Number, default: 100, min: 10 },
    resourceFileUrl: { type: String, default: "" },
    submissions: [submissionSchema],
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

assignmentSchema.index({ course: 1, dueDate: 1 });

export default mongoose.model("Assignment", assignmentSchema);

