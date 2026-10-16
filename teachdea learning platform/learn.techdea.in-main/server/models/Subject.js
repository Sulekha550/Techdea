import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      default: "",
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

subjectSchema.index({ semester: 1, order: 1 });

export default mongoose.model("Subject", subjectSchema);