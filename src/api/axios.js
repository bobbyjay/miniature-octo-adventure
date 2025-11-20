// src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://clutchden.onrender.com/api",
  timeout: 15000,
  withCredentials: false,
});

// attach token: handle tokens that already include "Bearer "
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // store EXACT token returned by backend

    if (token) {
      const headerValue = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      config.headers.Authorization = headerValue;
      console.log("🔐 Attached Authorization:", headerValue);
    } else {
      console.warn("⚠ No token in localStorage");
    }

    // Only set JSON for non-multipart requests
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// global response handling
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      console.warn("❌ 401 Unauthorized — clearing token from localStorage");
      localStorage.removeItem("token");
    }
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default axiosInstance;