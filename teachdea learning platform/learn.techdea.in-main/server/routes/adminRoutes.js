import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  dashboardStats,
  getStudents,
  updateStudentStatus
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", dashboardStats);
router.get("/students", getStudents);
router.patch("/students/:id/status", updateStudentStatus);

export default router;