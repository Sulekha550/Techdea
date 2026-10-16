import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  getSemesters,
  getSemester,
  createSemester,
  updateSemester,
  deleteSemester
} from "../controllers/semesterController.js";

const router = express.Router();

router.get("/", getSemesters);
router.get("/:id", getSemester);

router.post("/", protect, adminOnly, createSemester);
router.put("/:id", protect, adminOnly, updateSemester);
router.delete("/:id", protect, adminOnly, deleteSemester);

export default router;