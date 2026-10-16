import api from "./api.js";

export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser = (payload) => api.post("/auth/login", payload);
export const loginAdmin = (payload) => api.post("/auth/admin/login", payload);
export const getMe = () => api.get("/auth/me");

export const updateProfile = (payload) => api.put("/auth/profile", payload);
export const changePassword = (payload) => api.put("/auth/change-password", payload);
export const forgotPassword = (payload) => api.post("/auth/forgot-password", payload);
export const resetPassword = (token, payload) =>
  api.post(`/auth/reset-password/${token}`, payload);