import mongoose from "mongoose";

const liveClassSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    courseTitle: { type: String, default: "" },
    instructor: { type: String, default: "TechDea Lead" },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60, min: 15 },
    meetingPlatform: {
      type: String,
      enum: ["Zoom", "Google Meet", "YouTube Live", "Microsoft Teams"],
      default: "Google Meet"
    },
    meetingUrl: { type: String, default: "" },
    recordingUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed", "cancelled"],
      default: "upcoming"
    },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

liveClassSchema.index({ scheduledAt: 1, status: 1 });

export default mongoose.model("LiveClass", liveClassSchema);

