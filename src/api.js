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
   🔐 TOKEN ATTACHMENT (Raw JWT → Authorization: Bearer)
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

  // Used by AuthContext on refresh
  getMe: () => API.get("/users/me"),

  /* ---------------------------------------------------
     🖼️ PROFILE PICTURE FETCH METHODS (Blob stream)
  --------------------------------------------------- */

  // Authenticated user profile picture
  getAuthenticatedProfilePicture: () =>
    API.get("/users/profile-picture", { responseType: "blob" }),

  // ANY user's profile picture
  getProfilePicture: (id) =>
    API.get(`/users/${id}/profile-picture`, { responseType: "blob" }),

  // Old plural route
  getMyProfilePic: () => API.get("/users/profile-pictures"),

  // --- ACCOUNT ---
  getBalance: () => API.get("/account/balance"),

  /* ---------------------------------------------------
     🟢 FIXED TRANSACTIONS ENDPOINT (prevents 304)
  --------------------------------------------------- */
  transactions: () =>
    API.get("/account/transactions", {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    }),

  // --- NOTIFICATIONS ---
  getNotifications: () => API.get("/notifications"),
};

export default api;