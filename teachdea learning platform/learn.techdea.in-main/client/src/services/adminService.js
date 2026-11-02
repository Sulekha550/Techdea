import api from "./api.js";

// ==========================================
// 1. DASHBOARD OVERVIEW
// ==========================================
export const getAdminStats = () => api.get("/admin/dashboard");

// ==========================================
// 2. COURSES MANAGEMENT
// ==========================================
export const getAdminCourses = (params) => api.get("/courses?all=true", { params });
export const createCourse = (payload) => api.post("/courses", payload);
export const updateCourse = (id, payload) => api.put(`/courses/${id}`, payload);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Modules & Lectures (Curriculum)
export const getAdminModules = (courseId) =>
  api.get("/modules", { params: courseId ? { course: courseId } : {} });
export const createModule = (payload) => api.post("/modules", payload);
export const updateModule = (id, payload) => api.put(`/modules/${id}`, payload);
export const deleteModule = (id) => api.delete(`/modules/${id}`);
export const reorderModules = (items) => api.post("/modules/reorder", { items });

export const getAdminLectures = (moduleId) =>
  api.get("/lectures", { params: { all: "true", ...(moduleId ? { module: moduleId } : {}) } });
export const createLecture = (payload) => api.post("/lectures", payload);
export const updateLecture = (id, payload) => api.put(`/lectures/${id}`, payload);
export const deleteLecture = (id) => api.delete(`/lectures/${id}`);
export const reorderLectures = (items) => api.post("/lectures/reorder", { items });

// ==========================================
// 3. CATEGORIES MANAGEMENT
// ==========================================
export const getCategories = () => api.get("/admin/categories");
export const createCategory = (payload) => api.post("/admin/categories", payload);
export const updateCategory = (id, payload) => api.put(`/admin/categories/${id}`, payload);
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);

// ==========================================
// 4. STUDENTS MANAGEMENT
// ==========================================
export const getStudents = (params) => api.get("/admin/students", { params });
export const getStudentById = (id) => api.get(`/admin/students/${id}`);
export const createStudent = (payload) => api.post("/admin/students", payload);
export const updateStudentStatus = (id, isActive) =>
  api.patch(`/admin/students/${id}/status`, { isActive });
export const deleteStudent = (id) => api.delete(`/admin/students/${id}`);

// ==========================================
// 5. INSTRUCTOR MANAGEMENT
// ==========================================
export const getInstructors = () => api.get("/admin/instructors");
export const createInstructor = (payload) => api.post("/admin/instructors", payload);
export const updateInstructor = (id, payload) => api.put(`/admin/instructors/${id}`, payload);
export const updateInstructorStatus = (id, status) =>
  api.patch(`/admin/instructors/${id}/status`, { status });
export const deleteInstructor = (id) => api.delete(`/admin/instructors/${id}`);

// ==========================================
// 6. ENROLLMENT MANAGEMENT
// ==========================================
export const getAdminEnrollments = () => api.get("/enrollments");
export const updateEnrollment = (id, payload) => api.put(`/enrollments/${id}`, payload);

// ==========================================
// 7. LIVE CLASSES
// ==========================================
export const getLiveClasses = () => api.get("/admin/live-classes");
export const createLiveClass = (payload) => api.post("/admin/live-classes", payload);
export const updateLiveClass = (id, payload) => api.put(`/admin/live-classes/${id}`, payload);
export const deleteLiveClass = (id) => api.delete(`/admin/live-classes/${id}`);

// ==========================================
// 8. VIDEO LESSONS REPOSITORY
// ==========================================
export const getVideoLessons = (params) => api.get("/admin/video-lessons", { params });

// ==========================================
// 9. ASSIGNMENTS & PROJECTS
// ==========================================
export const getAssignments = () => api.get("/admin/assignments");
export const createAssignment = (payload) => api.post("/admin/assignments", payload);
export const updateAssignment = (id, payload) => api.put(`/admin/assignments/${id}`, payload);
export const deleteAssignment = (id) => api.delete(`/admin/assignments/${id}`);
export const gradeSubmission = (assignmentId, submissionId, payload) =>
  api.post(`/admin/assignments/${assignmentId}/grade/${submissionId}`, payload);

// ==========================================
// 10. QUIZZES & EXAMS
// ==========================================
export const getAdminTests = () => api.get("/tests?all=true");
export const getTestAdmin = (id) => api.get(`/tests/${id}/admin`);
export const createTest = (payload) => api.post("/tests", payload);
export const updateTest = (id, payload) => api.put(`/tests/${id}`, payload);
export const deleteTest = (id) => api.delete(`/tests/${id}`);
export const getQuizAttempts = () => api.get("/admin/quizzes/attempts");

// ==========================================
// 11. CERTIFICATES MANAGEMENT
// ==========================================
export const getAdminCertificates = () => api.get("/certificates/admin");

// ==========================================
// 12. PAYMENTS & TRANSACTIONS
// ==========================================
export const getAdminPayments = () => api.get("/payments");

// ==========================================
// 13. COUPONS & DISCOUNTS
// ==========================================
export const getCoupons = () => api.get("/admin/coupons");
export const createCoupon = (payload) => api.post("/admin/coupons", payload);
export const updateCoupon = (id, payload) => api.put(`/admin/coupons/${id}`, payload);
export const deleteCoupon = (id) => api.delete(`/admin/coupons/${id}`);

// ==========================================
// 14. REVIEWS & RATINGS
// ==========================================
export const getReviews = () => api.get("/admin/reviews");
export const updateReviewStatus = (id, payload) => api.patch(`/admin/reviews/${id}`, payload);
export const deleteReview = (id) => api.delete(`/admin/reviews/${id}`);

// ==========================================
// 15. LEARNING PROGRESS
// ==========================================
export const getLearningProgress = () => api.get("/admin/progress");

// ==========================================
// 16. NOTIFICATIONS & BROADCASTS
// ==========================================
export const getNotifications = () => api.get("/admin/notifications");
export const createBroadcast = (payload) => api.post("/admin/notifications/broadcast", payload);
export const deleteNotification = (id) => api.delete(`/admin/notifications/${id}`);

// ==========================================
// 17. REPORTS & ANALYTICS
// ==========================================
export const getReports = () => api.get("/admin/reports");

// ==========================================
// 18. WEBSITE CONTENT (CMS)
// ==========================================
export const getWebsiteContent = () => api.get("/admin/website-content");
export const updateWebsiteContent = (section, data) =>
  api.put("/admin/website-content", { section, data });

// ==========================================
// 19. ADMIN USERS & ROLES
// ==========================================
export const getAdminUsers = () => api.get("/admin/users-roles");
export const createAdminUser = (payload) => api.post("/admin/users-roles", payload);
export const updateAdminUser = (id, payload) => api.put(`/admin/users-roles/${id}`, payload);
export const deleteAdminUser = (id) => api.delete(`/admin/users-roles/${id}`);

// ==========================================
// 20. GENERAL SETTINGS
// ==========================================
export const getSettings = () => api.get("/admin/settings");
export const updateSettings = (payload) => api.put("/admin/settings", payload);

// Legacy semester routes (backward compatibility)
export const createSemester = (payload) => api.post("/semesters", payload);
export const updateSemester = (id, payload) => api.put(`/semesters/${id}`, payload);
export const deleteSemester = (id) => api.delete(`/semesters/${id}`);
export const createSubject = (payload) => api.post("/subjects", payload);
export const updateSubject = (id, payload) => api.put(`/subjects/${id}`, payload);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);
