import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "INR"
    },
    orderId: {
      type: String,
      default: ""
    },
    paymentId: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["created", "pending", "completed", "failed", "refunded"],
      default: "created"
    },
    paymentMethod: {
      type: String,
      default: "Razorpay/UPI"
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

paymentSchema.index({ student: 1, createdAt: -1 });

export default mongoose.model("Payment", paymentSchema);