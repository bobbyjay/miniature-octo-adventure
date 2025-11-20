// src/api.js
import axios from "axios";

// Always ensure trailing /api is present
let API_BASE =
  import.meta.env.VITE_API_BASE || "https://clutchden.onrender.com/api";

if (!API_BASE.endsWith("/api")) {
  API_BASE = API_BASE + "/api";
}

const API = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

/* ---------------------------------------------------
   🔐 REQUEST INTERCEPTOR (CORS FIX)
--------------------------------------------------- */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // 🔥 FIX: remove forbidden headers to avoid CORS failures
  if (config.headers) {
    delete config.headers["cache-control"];
    delete config.headers["Cache-Control"];
    delete config.headers["pragma"];
    delete config.headers["Pragma"];
  }

  // Explicitly send a safe header
  config.headers["Cache-Control"] = "no-store";

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

  // --- USERS ---
  getProfile: (id) => API.get(`/users/profile/${id}`),
  getMe: () => API.get("/users/me"),

  /* ---------------------------------------------------
     🖼️ PROFILE PICS (stream blob)
  --------------------------------------------------- */
  getAuthenticatedProfilePicture: () =>
    API.get("/users/profile-picture", { responseType: "blob" }),

  getProfilePicture: (id) =>
    API.get(`/users/${id}/profile-picture`, { responseType: "blob" }),

  getMyProfilePic: () => API.get("/users/profile-pictures"),

  // --- ACCOUNT ---
  getBalance: () => API.get("/account/balance"),

  /* ---------------------------------------------------
     🟢 TRANSACTIONS (no CORS errors anymore)
  --------------------------------------------------- */
  transactions: () =>
    API.get("/account/transactions", {
      headers: { "Cache-Control": "no-store" },
    }),

  // --- NOTIFICATIONS ---
  getNotifications: () => API.get("/notifications"),
};

export default api;