// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://clutchden.onrender.com/api",
  timeout: 15000,
});

/* ---------------------------------------------------
   🔐 FIXED TOKEN ATTACHMENT
   Your token in localStorage = just the raw JWT
   So we must ALWAYS prefix "Bearer " here.
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
   📌 API ROUTES (Matches your backend 100%)
--------------------------------------------------- */
const api = {
  // --- AUTH ---
  register: (data) => API.post("/auth/register", data),
  verifyEmail: (data) => API.post("/auth/verify-email", data),
  resendCode: (data) => API.post("/auth/resend-code", data),
  login: (data) => API.post("/auth/login", data),

  // --- USER ---
  // Returns: { success, message, data:{id,email,username} }
  getProfile: (id) => API.get(`/users/profile/${id}`),

  /* -----------------------------------------------
     🖼 PROFILE PICTURE FIX
     Your backend returns:
     {
       "success": true,
       "message": "OK",
       "data": [
         {
            "id": "...",
            "username": "...",
            "streamUrl": "/api/users/{id}/profile-picture"
         }
       ]
     }

     So this endpoint should be JSON, NOT blob.
  -------------------------------------------------*/
  getMyProfilePic: () => API.get("/users/profile-picture"),

  // --- ACCOUNT ---
  // Returns: { success, message, data:{ balance } }
  getBalance: () => API.get("/account/balance"),

  // Returns: { success, message, data:[...] }
  transactions: () => API.get("/account/transactions"),

  // --- NOTIFICATIONS ---
  getNotifications: () => API.get("/notifications"),
};

export default api;