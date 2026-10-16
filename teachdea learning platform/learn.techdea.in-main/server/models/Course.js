import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    shortDescription: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    branch: { type: String, default: "Technology", trim: true },
    category: { type: String, default: "Web Development", trim: true },
    duration: { type: String, default: "10 Weeks" },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "All Levels"
    },
    price: { type: Number, default: 0, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    instructor: {
      name: { type: String, default: "TechDea Academy" },
      title: { type: String, default: "Senior Technical Lead" },
      bio: { type: String, default: "Experienced industry engineer and mentor." },
      avatar: { type: String, default: "" }
    },
    rating: { type: Number, default: 4.8, min: 1, max: 5 },
    ratingCount: { type: Number, default: 24 },
    studentsCount: { type: Number, default: 0 },
    whatYouWillLearn: [{ type: String }],
    requirements: [{ type: String }],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

courseSchema.virtual("title").get(function () {
  return this.name;
});

courseSchema.index({ category: 1, isPublished: 1, isActive: 1 });

export default mongoose.model("Course", courseSchema);