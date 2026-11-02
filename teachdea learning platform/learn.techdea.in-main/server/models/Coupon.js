import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: "" },
    discountPercentage: { type: Number, required: true, min: 1, max: 100 },
    maxDiscount: { type: Number, default: 2000, min: 0 },
    minPurchase: { type: Number, default: 0, min: 0 },
    validUntil: { type: Date },
    usageLimit: { type: Number, default: 100, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

couponSchema.index({ code: 1, isActive: 1 });

export default mongoose.model("Coupon", couponSchema);

