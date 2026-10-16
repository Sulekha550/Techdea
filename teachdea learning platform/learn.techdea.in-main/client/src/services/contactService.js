import api from "./api.js";

export const submitContact = (payload) => api.post("/contact", payload);
export const getContactMessages = (params) => api.get("/contact", { params });
export const updateContactStatus = (id, payload) =>
  api.patch(`/contact/${id}/status`, payload);
export const deleteContactMessage = (id) => api.delete(`/contact/${id}`);
