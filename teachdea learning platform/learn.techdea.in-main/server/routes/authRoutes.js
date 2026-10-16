import express from "express";
import {
  register,
  login,
  adminLogin,
  me,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;