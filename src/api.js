// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://clutchden.onrender.com",
  withCredentials: true,
});

// Add Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Export all endpoints
const api = {
  login: (data) => API.post("/api/auth/login", data),
  register: (data) => API.post("/api/auth/register", data),
  verifyEmail: (data) => API.post("/api/auth/verify-email", data),
  resendCode: (data) => API.post("/api/auth/resend-code", data),

  getMe: () => API.get("/api/users/me"),
  updateProfile: (data) => API.put("/api/users/update-profile", data),
  updatePassword: (data) => API.put("/api/users/update-password", data),
  deleteAccount: (data) => API.delete("/api/users/delete-account", { data }),

  deposit: (data) => API.post("/api/wallet/deposit", data),
  withdraw: (data) => API.post("/api/wallet/withdraw", data),
  walletHistory: () => API.get("/api/wallet/history"),

  getNotifications: () => API.get("/api/notifications"),
  readNotification: (id) => API.put(`/api/notifications/read/${id}`),
  readAllNotifications: () => API.put("/api/notifications/read-all"),

  uploadProfilePic: (file) => {
    const form = new FormData();
    form.append("image", file);
    return API.post("/api/upload/profile-picture", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  supportSend: (data) =>
    API.post("/api/support/tickets", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  supportList: () => API.get("/api/support/tickets"),
};

export default api;