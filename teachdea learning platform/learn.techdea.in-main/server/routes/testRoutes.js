import express from "express";
import {
  getTests,
  getTest,
  getTestForAdmin,
  createTest,
  updateTest,
  deleteTest,
  submitTestAttempt,
  getMyAttempts
} from "../controllers/testController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getTests);
router.get("/my-attempts", protect, getMyAttempts);
router.get("/:id", getTest);
router.get("/:id/admin", protect, adminOnly, getTestForAdmin);

router.post("/", protect, adminOnly, createTest);
router.put("/:id", protect, adminOnly, updateTest);
router.delete("/:id", protect, adminOnly, deleteTest);

router.post("/:id/submit", protect, submitTestAttempt);

export default router;