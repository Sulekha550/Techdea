import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["NEW", "READ", "REPLIED", "CLOSED"],
      default: "NEW"
    },
    adminNotes: {
      type: String,
      default: ""
    },
    whatsappSent: {
      type: Boolean,
      default: false
    },
    whatsappMessageId: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("ContactMessage", contactMessageSchema);
