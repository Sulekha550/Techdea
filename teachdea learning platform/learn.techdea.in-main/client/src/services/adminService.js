import api from "./api.js";

// Dashboard
export const getAdminStats = () => api.get("/admin/dashboard");

// Students
export const getStudents = () => api.get("/admin/students");
export const updateStudentStatus = (id, isActive) =>
  api.patch(`/admin/students/${id}/status`, { isActive });

// Courses
export const getAdminCourses = () => api.get("/courses?all=true");
export const createCourse = (payload) => api.post("/courses", payload);
export const updateCourse = (id, payload) => api.put(`/courses/${id}`, payload);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Modules
export const getAdminModules = (courseId) =>
  api.get("/modules", { params: courseId ? { course: courseId } : {} });
export const createModule = (payload) => api.post("/modules", payload);
export const updateModule = (id, payload) => api.put(`/modules/${id}`, payload);
export const deleteModule = (id) => api.delete(`/modules/${id}`);
export const reorderModules = (items) => api.post("/modules/reorder", { items });

// Lessons / Lectures
export const getAdminLectures = (moduleId) =>
  api.get("/lectures", { params: { all: "true", ...(moduleId ? { module: moduleId } : {}) } });
export const createLecture = (payload) => api.post("/lectures", payload);
export const updateLecture = (id, payload) => api.put(`/lectures/${id}`, payload);
export const deleteLecture = (id) => api.delete(`/lectures/${id}`);
export const reorderLectures = (items) => api.post("/lectures/reorder", { items });

// Quizzes / Tests
export const getAdminTests = () => api.get("/tests?all=true");
export const getTestAdmin = (id) => api.get(`/tests/${id}/admin`);
export const createTest = (payload) => api.post("/tests", payload);
export const updateTest = (id, payload) => api.put(`/tests/${id}`, payload);
export const deleteTest = (id) => api.delete(`/tests/${id}`);

// Enrollments & Payments
export const getAdminEnrollments = () => api.get("/enrollments");
export const updateEnrollment = (id, payload) => api.put(`/enrollments/${id}`, payload);
export const getAdminPayments = () => api.get("/payments");

// Certificates
export const getAdminCertificates = () => api.get("/certificates/admin");

// Legacy Semesters & Subjects
export const createSemester = (payload) => api.post("/semesters", payload);
export const updateSemester = (id, payload) => api.put(`/semesters/${id}`, payload);
export const deleteSemester = (id) => api.delete(`/semesters/${id}`);
export const createSubject = (payload) => api.post("/subjects", payload);
export const updateSubject = (id, payload) => api.put(`/subjects/${id}`, payload);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);