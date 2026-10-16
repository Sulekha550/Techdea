import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    },
    lastPositionSeconds: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, lecture: 1 }, { unique: true });
progressSchema.index({ student: 1, course: 1 });

export default mongoose.model("Progress", progressSchema);