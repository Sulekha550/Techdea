import mongoose from "mongoose";

const platformSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    siteName: { type: String, default: "TechDea Learn" },
    tagline: { type: String, default: "Master Modern Technology & Engineering" },
    supportEmail: { type: String, default: "support@techdea.in" },
    supportPhone: { type: String, default: "+91 9876543210" },
    currencySymbol: { type: String, default: "₹" },
    currencyCode: { type: String, default: "INR" },
    paymentGateway: {
      provider: { type: String, default: "Razorpay" },
      testMode: { type: Boolean, default: true },
      keyId: { type: String, default: "rzp_test_sampleKey123" }
    },
    features: {
      autoIssueCertificates: { type: Boolean, default: true },
      enableStudentDiscussion: { type: Boolean, default: true },
      maintenanceMode: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

export default mongoose.model("PlatformSetting", platformSettingSchema);
