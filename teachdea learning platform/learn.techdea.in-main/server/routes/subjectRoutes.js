import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} from "../controllers/subjectController.js";

const router = express.Router();

router.get("/", getSubjects);
router.get("/:id", getSubject);

router.post("/", protect, adminOnly, createSubject);
router.put("/:id", protect, adminOnly, updateSubject);
router.delete("/:id", protect, adminOnly, deleteSubject);

export default router;