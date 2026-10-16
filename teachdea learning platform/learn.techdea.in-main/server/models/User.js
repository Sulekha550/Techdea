import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },
    avatar: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);