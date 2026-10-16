import express from "express";
import {
  submitContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage
} from "../controllers/contactController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", submitContactMessage);
router.get("/", protect, adminOnly, getContactMessages);
router.patch("/:id/status", protect, adminOnly, updateContactStatus);
router.delete("/:id", protect, adminOnly, deleteContactMessage);

export default router;
