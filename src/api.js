// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://clutchden.onrender.com/api",
  timeout: 15000,
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = token; // token ALREADY contains "Bearer "
  return config;
});

// Global error handler
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

const api = {
  // --- AUTH ---
  register: (data) => API.post("/auth/register", data),
  verifyEmail: (data) => API.post("/auth/verify-email", data),
  resendCode: (data) => API.post("/auth/resend-code", data),
  login: (data) => API.post("/auth/login", data),

  // --- USER ---
  getProfile: (id) => API.get(`/users/profile/${id}`),

  // ❗ FIXED: backend RETURNS a JSON, NOT a blob
  getMyProfilePic: () => API.get("/users/profile-picture"),

  // --- ACCOUNT ---
  getBalance: () => API.get("/account/balance"),
  transactions: () => API.get("/account/transactions"),

  // --- NOTIFICATIONS ---
  getNotifications: () => API.get("/notifications"),
};

export default api;