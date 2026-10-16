import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: [{ type: String, required: true }],
    answer: { type: Number, required: true, min: 0 },
    marks: { type: Number, default: 1, min: 1 },
    explanation: { type: String, default: "" }
  },
  { _id: true }
);

const testSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module"
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"
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
    durationMinutes: {
      type: Number,
      default: 15,
      min: 1
    },
    passingPercentage: {
      type: Number,
      default: 50,
      min: 1,
      max: 100
    },
    questions: [questionSchema],
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

testSchema.index({ course: 1, isPublished: 1 });
testSchema.index({ subject: 1, isPublished: 1 });

export default mongoose.model("Test", testSchema);