import express from "express";
import {
  claimCertificate,
  getMyCertificates,
  verifyCertificate,
  getAdminCertificates
} from "../controllers/certificateController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public verification
router.get("/verify/:certificateId", verifyCertificate);

// Student endpoints
router.get("/my", protect, getMyCertificates);
router.post("/claim/:courseId", protect, claimCertificate);

// Admin endpoint
router.get("/admin", protect, adminOnly, getAdminCertificates);

export default router;
