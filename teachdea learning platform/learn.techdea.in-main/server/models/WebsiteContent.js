import mongoose from "mongoose";

const websiteContentSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, unique: true, trim: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedBy: { type: String, default: "Admin" }
  },
  { timestamps: true }
);

export default mongoose.model("WebsiteContent", websiteContentSchema);
