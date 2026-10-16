import api from "./api.js";

// Course & Curriculum
export const getCourses = (params) => api.get("/courses", { params });
export const getCourse = (id) => api.get(`/courses/${id}`);
export const getModules = (courseId) =>
  api.get("/modules", { params: courseId ? { course: courseId } : {} });
export const getLectures = (moduleId) =>
  api.get("/lectures", { params: moduleId ? { module: moduleId } : {} });
export const getLecture = (id) => api.get(`/lectures/${id}`);

// Legacy Semesters & Subjects (Preserved)
export const getSemesters = (courseId) =>
  api.get("/semesters", { params: courseId ? { course: courseId } : {} });
export const getSemester = (id) => api.get(`/semesters/${id}`);
export const getSubjects = (semesterId) =>
  api.get("/subjects", { params: semesterId ? { semester: semesterId } : {} });
export const getSubject = (id) => api.get(`/subjects/${id}`);

// Enrollments
export const enrollCourse = (courseId) => api.post("/enrollments", { courseId });
export const enrollSemester = (semesterId) => api.post("/enrollments", { semesterId });
export const checkEnrollment = (semesterId) => api.get(`/enrollments/check/${semesterId}`);
export const checkCourseEnrollment = (courseId) =>
  api.get(`/enrollments/check-course/${courseId}`);
export const getMyEnrollments = () => api.get("/enrollments/my");

// Payments
export const createPayment = (payload) => api.post("/payments", payload);
export const verifyPayment = (payload) => api.post("/payments/verify", payload);
export const getMyPayments = () => api.get("/payments/my");

// Progress Tracking
export const getCourseProgress = (courseId) => api.get(`/progress/course/${courseId}`);
export const toggleLessonProgress = (payload) => api.post("/progress/toggle", payload);
export const getProgressSummary = () => api.get("/progress/summary");

// Quizzes & Tests
export const getTests = (params) => {
  const query = typeof params === "string" ? { subject: params } : params || {};
  return api.get("/tests", { params: query });
};
export const getTest = (id) => api.get(`/tests/${id}`);
export const submitQuiz = (testId, payload) =>
  api.post(`/tests/${testId}/submit`, payload);
export const getMyQuizAttempts = (testId) =>
  api.get("/tests/my-attempts", { params: testId ? { testId } : {} });

// Certificates
export const claimCertificate = (courseId) =>
  api.post(`/certificates/claim/${courseId}`);
export const getMyCertificates = () => api.get("/certificates/my");
export const verifyCertificate = (certificateId) =>
  api.get(`/certificates/verify/${certificateId}`);