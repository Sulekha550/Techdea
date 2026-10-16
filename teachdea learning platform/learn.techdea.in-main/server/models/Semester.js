import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    number: {
      type: Number,
      required: true,
      min: 1
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    duration: {
      type: String,
      default: ""
    },
    thumbnail: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

semesterSchema.index({ course: 1, number: 1 }, { unique: true });

export default mongoose.model("Semester", semesterSchema);