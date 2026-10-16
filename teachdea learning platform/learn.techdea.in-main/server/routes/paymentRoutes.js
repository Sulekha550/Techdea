import express from "express";
import {
  createPaymentRecord,
  verifyPayment,
  myPayments,
  adminPayments
} from "../controllers/paymentController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, createPaymentRecord);
router.post("/verify", protect, verifyPayment);
router.get("/my", protect, myPayments);

router.get("/", protect, adminOnly, adminPayments);

export default router;