// src/api.js
import axios from "axios";

// Proxy target: http://localhost:3000/api → forwarded to https://clutchden.onrender.com/api
const API_BASE = "/api";

const API = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

/* ---------------------------------------------------
   🔐 TOKEN ATTACHMENT
--------------------------------------------------- */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ---------------------------------------------------
   🌐 GLOBAL ERROR HANDLER
--------------------------------------------------- */
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

/* ---------------------------------------------------
   📌 CLEAN API ROUTES
--------------------------------------------------- */
const api = {
  // --- AUTH ---
  register: (data) => API.post("/auth/register", data),
  verifyEmail: (data) => API.post("/auth/verify-email", data),
  resendCode: (data) => API.post("/auth/resend-code", data),
  login: (data) => API.post("/auth/login", data),

  // --- USERS ---
  getProfile: (id) => API.get(`/users/profile/${id}`),
  getMe: () => API.get("/users/me"),

  // Profile picture blob streams
  getAuthenticatedProfilePicture: () =>
    API.get("/users/profile-picture", { responseType: "blob" }),
  getProfilePicture: (id) =>
    API.get(`/users/${id}/profile-picture`, { responseType: "blob" }),
  getMyProfilePic: () => API.get("/users/profile-pictures"),

  // --- ACCOUNT ---
  getBalance: () => API.get("/account/balance"),
  transactions: () => API.get("/account/transactions"),

  // --- NOTIFICATIONS ---
  getNotifications: () => API.get("/notifications"),
};

export default api;