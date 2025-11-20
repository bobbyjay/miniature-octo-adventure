// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://clutchden.onrender.com/api",
  timeout: 15000,
});

/* ---------------------------------------------------
   🔐 TOKEN ATTACHMENT (Correct Version)
   Your localStorage stores ONLY the raw JWT.
   So we ALWAYS prepend "Bearer ".
--------------------------------------------------- */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
   📌 API ROUTES
--------------------------------------------------- */
const api = {
  // --- AUTH ---
  register: (data) => API.post("/auth/register", data),
  verifyEmail: (data) => API.post("/auth/verify-email", data),
  resendCode: (data) => API.post("/auth/resend-code", data),
  login: (data) => API.post("/auth/login", data),

  // --- USER ---
  getProfile: (id) => API.get(`/users/profile/${id}`),

  // 🔥 Required by AuthContext on refresh
  getMe: () => API.get("/users/me"),

  /* -----------------------------------------------
     🖼 PROFILE PICTURE FIX
     Your backend returns JSON containing streamUrl.
     So we do NOT use blob here.
  -------------------------------------------------*/
  getMyProfilePic: () => API.get("/users/profile-picture"),

  // --- ACCOUNT ---
  getBalance: () => API.get("/account/balance"),
  transactions: () => API.get("/account/transactions"),

  // --- NOTIFICATIONS ---
  getNotifications: () => API.get("/notifications"),
};

export default api;