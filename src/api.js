// src/api.js
import axios from "axios";

// Ensure trailing /api
let API_BASE =
  import.meta.env.VITE_API_BASE || "https://clutchden.onrender.com/api";

if (!API_BASE.endsWith("/api")) API_BASE += "/api";

// Completely override default Axios headers globally
axios.defaults.headers.common["Cache-Control"] = "no-store";
axios.defaults.headers.common["Pragma"] = "no-store";
axios.defaults.headers.common["Expires"] = "0";

const API = axios.create({
  baseURL: API_BASE,
  timeout: 15000,

  // ❌ <--- OVERRIDES ALL unwanted browser cache headers
  headers: {
    "Cache-Control": "no-store",
    Pragma: "no-store",
    Expires: "0",
  },
});

/* ---------------------------------------------------
   🔐 REQUEST INTERCEPTOR (REMOVE BAD HEADERS)
--------------------------------------------------- */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Remove browser-added forbidden headers
  delete config.headers["cache-control"];
  delete config.headers["Cache-Control"];
  delete config.headers["pragma"];
  delete config.headers["Pragma"];
  delete config.headers["Expires"];
  delete config.headers["expires"];

  // Add allowed header only
  config.headers["Cache-Control"] = "no-store";

  return config;
});

/* ---------------------------------------------------
   🌐 RESPONSE INTERCEPTOR
--------------------------------------------------- */
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

/* ---------------------------------------------------
   API ROUTES
--------------------------------------------------- */
const api = {
  register: (data) => API.post("/auth/register", data),
  verifyEmail: (data) => API.post("/auth/verify-email", data),
  resendCode: (data) => API.post("/auth/resend-code", data),
  login: (data) => API.post("/auth/login", data),

  getProfile: (id) => API.get(`/users/profile/${id}`),
  getMe: () => API.get("/users/me"),

  getAuthenticatedProfilePicture: () =>
    API.get("/users/profile-picture", { responseType: "blob" }),

  getProfilePicture: (id) =>
    API.get(`/users/${id}/profile-picture`, { responseType: "blob" }),

  getMyProfilePic: () => API.get("/users/profile-pictures"),

  getBalance: () => API.get("/account/balance"),

  // Transactions
  transactions: () =>
    API.get("/account/transactions", {
      headers: {
        "Cache-Control": "no-store",
      },
    }),

  getNotifications: () => API.get("/notifications"),
};

export default api;