import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  dashboardStats,
  // Students
  getStudents,
  getStudentById,
  createStudent,
  updateStudentStatus,
  deleteStudent,
  // Instructors
  getInstructors,
  createInstructor,
  updateInstructor,
  updateInstructorStatus,
  deleteInstructor,
  // Categories
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  // Live Classes
  getLiveClasses,
  createLiveClass,
  updateLiveClass,
  deleteLiveClass,
  // Video Lessons
  getVideoLessons,
  // Assignments
  getAssignments,
  createAssignment,
  updateAssignment,
  gradeSubmission,
  deleteAssignment,
  // Quizzes & Exams
  getQuizzes,
  getQuizAttempts,
  // Coupons & Discounts
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  // Reviews & Ratings
  getReviews,
  updateReviewStatus,
  deleteReview,
  // Progress
  getLearningProgress,
  // Notifications
  getNotifications,
  createBroadcast,
  deleteNotification,
  // Website CMS
  getWebsiteContent,
  updateWebsiteContent,
  // Admin Users & Roles
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  // Platform Settings
  getSettings,
  updateSettings,
  // Reports
  getReports
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all admin routes
router.use(protect, adminOnly);

// 1. Dashboard Overview
router.get("/dashboard", dashboardStats);

// 2. Students
router.get("/students", getStudents);
router.post("/students", createStudent);
router.get("/students/:id", getStudentById);
router.patch("/students/:id/status", updateStudentStatus);
router.delete("/students/:id", deleteStudent);

// 3. Instructors
router.get("/instructors", getInstructors);
router.post("/instructors", createInstructor);
router.put("/instructors/:id", updateInstructor);
router.patch("/instructors/:id/status", updateInstructorStatus);
router.delete("/instructors/:id", deleteInstructor);

// 4. Categories
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// 5. Live Classes
router.get("/live-classes", getLiveClasses);
router.post("/live-classes", createLiveClass);
router.put("/live-classes/:id", updateLiveClass);
router.delete("/live-classes/:id", deleteLiveClass);

// 6. Video Lessons
router.get("/video-lessons", getVideoLessons);

// 7. Assignments & Submissions
router.get("/assignments", getAssignments);
router.post("/assignments", createAssignment);
router.put("/assignments/:id", updateAssignment);
router.delete("/assignments/:id", deleteAssignment);
router.post("/assignments/:assignmentId/grade/:submissionId", gradeSubmission);

// 8. Quizzes & Exams
router.get("/quizzes", getQuizzes);
router.get("/quizzes/attempts", getQuizAttempts);

// 9. Coupons & Discounts
router.get("/coupons", getCoupons);
router.post("/coupons", createCoupon);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

// 10. Reviews & Ratings
router.get("/reviews", getReviews);
router.patch("/reviews/:id", updateReviewStatus);
router.delete("/reviews/:id", deleteReview);

// 11. Learning Progress
router.get("/progress", getLearningProgress);

// 12. Notifications & Announcements
router.get("/notifications", getNotifications);
router.post("/notifications/broadcast", createBroadcast);
router.delete("/notifications/:id", deleteNotification);

// 13. Website Content (CMS)
router.get("/website-content", getWebsiteContent);
router.put("/website-content", updateWebsiteContent);

// 14. Admin Users & Roles
router.get("/users-roles", getAdminUsers);
router.post("/users-roles", createAdminUser);
router.put("/users-roles/:id", updateAdminUser);
router.delete("/users-roles/:id", deleteAdminUser);

// 15. General Settings
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// 16. Reports & Analytics
router.get("/reports", getReports);

export default router;
