// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://clutchden.onrender.com/api",
  withCredentials: false,
  timeout: 15000,
});

// Inject token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err.response?.data || err.message);
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

const api = {
  // ------------------------------
  // AUTH
  // ------------------------------
  register: (data) => API.post("/auth/register", data),
  verifyEmail: (data) => API.post("/auth/verify-email", data),
  resendCode: (data) => API.post("/auth/resend-code", data),
  login: (data) => API.post("/auth/login", data),

  // ------------------------------
  // USERS
  // ------------------------------

  // Get profile of CURRENT user
  getMe: () => {
    const id = localStorage.getItem("userId");
    return API.get(`/users/profile/${id}`);
  },

  // Get CURRENT user's profile picture
  getMyProfilePic: () => API.get(`/users/profile-picture`, { responseType: "blob" }),

  // Get another user’s profile picture
  getUserProfilePic: (id) =>
    API.get(`/users/${id}/profile-picture`, { responseType: "blob" }),

  // Leaderboard
  leaderboard: () => API.get("/users/leaderboard"),

  // ------------------------------
  // ACCOUNT / WALLET (MATCHING BACKEND)
  // ------------------------------
  getBalance: () => API.get("/account/balance"),
  deposit: (data) => API.post("/account/deposit", data),
  withdraw: (data) => API.post("/account/withdraw", data),
  transactions: () => API.get("/account/transactions"),

  // ------------------------------
  // NOTIFICATIONS — backend not provided, so safe fallback
  // ------------------------------
  getNotifications: () => API.get("/notifications").catch(() => ({ data: [] })),

  readNotification: (id) => API.put(`/notifications/read/${id}`).catch(() => {}),
  readAllNotifications: () => API.put("/notifications/read-all").catch(() => {}),

  // ------------------------------
  // PROFILE PICTURE UPLOAD
  // ------------------------------
  uploadProfilePic: (file) => {
    const form = new FormData();
    form.append("image", file);
    return API.post("/upload/profile-picture", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;