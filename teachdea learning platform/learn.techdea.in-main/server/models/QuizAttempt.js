import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOption: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    marksObtained: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    answers: [answerSchema],
    score: {
      type: Number,
      required: true,
      default: 0
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 0
    },
    percentage: {
      type: Number,
      required: true,
      default: 0
    },
    passed: {
      type: Boolean,
      required: true,
      default: false
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

quizAttemptSchema.index({ student: 1, test: 1 });

export default mongoose.model("QuizAttempt", quizAttemptSchema);
