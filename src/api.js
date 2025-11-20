// src/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://clutchden.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

/* ---------------------------------------------------
   🔐 FIXED TOKEN ATTACHMENT
   IMPORTANT:
   Your localStorage contains *raw* JWT only.
   Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
   So we MUST attach:  Authorization: Bearer <token>
--------------------------------------------------- */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // RAW TOKEN
  if (token) {
    // Attach correctly — no double Bearer
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
   📌 API ROUTES (Matches backend 100%)
--------------------------------------------------- */
const api = {
  // --- AUTH ---
  register: (data) => API.post("/auth/register", data),
  verifyEmail: (data) => API.post("/auth/verify-email", data),
  resendCode: (data) => API.post("/auth/resend-code", data),
  login: (data) => API.post("/auth/login", data),

  // --- USER ---
  getProfile: (id) => API.get(`/users/profile/${id}`),

  // Used by AuthContext on page refresh
  getMe: () => API.get("/users/me"),

  /* -----------------------------------------------
     🖼 PROFILE PICTURE
     Backend returns JSON:
     {
       data: [
         { streamUrl: "/api/users/123/profile-picture" }
       ]
     }
     So we do NOT request a blob.
  --------------------------------------------------- */
  getMyProfilePic: () => API.get("/users/profile-picture"),

  // --- ACCOUNT ---
  getBalance: () => API.get("/account/balance"),
  transactions: () => API.get("/account/transactions"),

  // --- NOTIFICATIONS ---
  getNotifications: () => API.get("/notifications"),
};

export default api;