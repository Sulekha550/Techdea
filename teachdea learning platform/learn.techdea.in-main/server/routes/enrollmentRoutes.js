import express from "express";
import {
  createEnrollment,
  myEnrollments,
  getEnrollment,
  checkCourseEnrollment,
  adminEnrollments,
  updateEnrollment
} from "../controllers/enrollmentController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, createEnrollment);
router.get("/my", protect, myEnrollments);
router.get("/check-course/:courseId", protect, checkCourseEnrollment);
router.get("/check/:semesterId", protect, getEnrollment);

router.get("/", protect, adminOnly, adminEnrollments);
router.put("/:id", protect, adminOnly, updateEnrollment);

export default router;