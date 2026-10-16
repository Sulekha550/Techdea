import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
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
    contentType: {
      type: String,
      enum: ["video", "text", "pdf", "quiz", "resource", "assignment"],
      default: "video"
    },
    videoId: {
      type: String,
      default: ""
    },
    videoUrl: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    pdfUrl: {
      type: String,
      default: ""
    },
    noteUrl: {
      type: String,
      default: ""
    },
    resourceUrl: {
      type: String,
      default: ""
    },
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, default: "link" }
      }
    ],
    duration: {
      type: String,
      default: "15 min"
    },
    order: {
      type: Number,
      default: 0
    },
    isPreview: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

lectureSchema.index({ module: 1, order: 1 });

export default mongoose.model("Lecture", lectureSchema);