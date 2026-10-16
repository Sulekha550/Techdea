import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourse);

router.post("/", protect, adminOnly, createCourse);
router.put("/:id", protect, adminOnly, updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);

export default router;