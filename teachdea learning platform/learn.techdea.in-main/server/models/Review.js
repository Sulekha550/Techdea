import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    courseTitle: { type: String, default: "" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: { type: String, required: true },
    studentAvatar: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["approved", "pending", "flagged"],
      default: "approved"
    },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

reviewSchema.index({ course: 1, status: 1 });

export default mongoose.model("Review", reviewSchema);
