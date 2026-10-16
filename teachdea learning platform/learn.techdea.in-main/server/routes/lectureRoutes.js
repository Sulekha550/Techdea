import express from "express";
import {
  getLectures,
  getLecture,
  createLecture,
  updateLecture,
  deleteLecture,
  reorderLectures
} from "../controllers/lectureController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Optional protect middleware for getLecture so user details are loaded if token is present
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return protect(req, res, next);
  }
  next();
};

router.get("/", getLectures);
router.get("/:id", optionalProtect, getLecture);
router.post("/", protect, adminOnly, createLecture);
router.put("/:id", protect, adminOnly, updateLecture);
router.delete("/:id", protect, adminOnly, deleteLecture);
router.post("/reorder", protect, adminOnly, reorderLectures);

export default router;