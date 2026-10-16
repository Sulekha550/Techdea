import express from "express";
import {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  reorderModules
} from "../controllers/moduleController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getModules);
router.post("/", protect, adminOnly, createModule);
router.put("/:id", protect, adminOnly, updateModule);
router.delete("/:id", protect, adminOnly, deleteModule);
router.post("/reorder", protect, adminOnly, reorderModules);

export default router;
