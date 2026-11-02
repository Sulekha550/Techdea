import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    icon: { type: String, default: "code" },
    description: { type: String, default: "" },
    coursesCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1, isActive: 1 });

export default mongoose.model("Category", categorySchema);
