// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://clutchden.onrender.com/api",
  withCredentials: false, // backend NOT using cookies
  timeout: 15000,
});

// ----------------------------------
// ATTACH TOKEN TO EVERY REQUEST
// ----------------------------------
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ----------------------------------
// GLOBAL ERROR HANDLER
// ----------------------------------
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err.response?.data || err.message);

    // Auto-logout on invalid token
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(err);
  }
);

// ===================================================================
// ALL ROUTES 100% MATCHING YOUR BACKEND
// ===================================================================
const api = {
  // ----------------------------------
  // AUTH ROUTES
  // ----------------------------------
  register: (data) => API.post("/auth/register", data),
  verifyEmail: (data) => API.post("/auth/verify-email", data),
  resendCode: (data) => API.post("/auth/resend-code", data),
  login: (data) => API.post("/auth/login", data),

  // ----------------------------------
  // USER ROUTES
  // ----------------------------------
  getMe: () => API.get("/users/me"),
  updateProfile: (data) => API.put("/users/update-profile", data),
  updatePassword: (data) => API.put("/users/update-password", data),
  deleteAccount: (data) =>
    API.delete("/users/delete-account", {
      data, // axios DELETE must include { data }
    }),

  // ----------------------------------
  // WALLET ROUTES
  // ----------------------------------
  deposit: (data) => API.post("/wallet/deposit", data),
  withdraw: (data) => API.post("/wallet/withdraw", data),
  walletHistory: () => API.get("/wallet/history"),

  // ----------------------------------
  // NOTIFICATION ROUTES
  // ----------------------------------
  getNotifications: () => API.get("/notifications"),
  readNotification: (id) => API.put(`/notifications/read/${id}`),
  readAllNotifications: () => API.put("/notifications/read-all"),

  // ----------------------------------
  // PROFILE PICTURE UPLOAD
  // ----------------------------------
  uploadProfilePic: (file) => {
    const form = new FormData();
    form.append("image", file);

    return API.post("/upload/profile-picture", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // ----------------------------------
  // SUPPORT TICKET ROUTES
  // ----------------------------------
  supportSend: (data) =>
    API.post("/support/tickets", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  supportList: () => API.get("/support/tickets"),
};

export default api;