import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  // AUTH
  register: (data) => API.post("/api/auth/register", data),
  verifyEmail: (data) => API.post("/api/auth/verify-email", data),
  resendCode: (data) => API.post("/api/auth/resend-code", data),
  login: (data) => API.post("/api/auth/login", data),

  // USER
  getMe: () => API.get("/api/users/me"),
  updateProfile: (data) => API.put("/api/users/update-profile", data),
  updatePassword: (data) => API.put("/api/users/update-password", data),
  deleteAccount: (data) => API.delete("/api/users/delete-account", { data }),

  // WALLET
  deposit: (data) => API.post("/api/wallet/deposit", data),
  withdraw: (data) => API.post("/api/wallet/withdraw", data),
  walletHistory: () => API.get("/api/wallet/history"),

  // NOTIFICATIONS
  getNotifications: () => API.get("/api/notifications"),
  readNotification: (id) => API.put(`/api/notifications/read/${id}`),
  readAllNotifications: () => API.put("/api/notifications/read-all"),

  // UPLOAD
  uploadProfilePic: (file) => {
    const form = new FormData();
    form.append("image", file);
    return API.post("/api/upload/profile-picture", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // SUPPORT
  // Create a ticket (form-data: subject, message, image)
  createSupportTicket: (formData) =>
    API.post("/api/support/tickets", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Get all tickets for the authenticated user (requires Authorization header)
  getSupportTickets: (params) =>
    // optional params object becomes query string: e.g. ?status=open&page=1
    API.get("/api/support/tickets", { params }),

  // Get a single ticket by id
  getSupportTicket: (id) => API.get(`/api/support/tickets/${id}`),

  // ADMIN (existing)
  adminUsers: () => API.get("/api/admin/users"),
  adminDisable: (id) => API.put(`/api/admin/disable/${id}`),
  adminEnable: (id) => API.put(`/api/admin/enable/${id}`),
  adminDelete: (id) => API.delete(`/api/admin/delete/${id}`),

  // SYSTEM
  health: () => API.get("/api/health"),
};