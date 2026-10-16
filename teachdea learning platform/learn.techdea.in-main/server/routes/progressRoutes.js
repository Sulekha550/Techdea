import express from "express";
import {
  toggleLessonProgress,
  getCourseProgress,
  getProgressSummary
} from "../controllers/progressController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/toggle", toggleLessonProgress);
router.get("/course/:courseId", getCourseProgress);
router.get("/summary", getProgressSummary);

export default router;
