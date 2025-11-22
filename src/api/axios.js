// src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://clutchden.onrender.com/api",
  timeout: 15000,
  withCredentials: false,
});

// attach token safely
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      const headerValue = token.startsWith("Bearer ") 
        ? token 
        : `Bearer ${token}`;

      config.headers.Authorization = headerValue;

      console.log("🔐 Attached Authorization:", headerValue);
    }

    // default JSON header only when not uploading files
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// global error handler
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    if (status === 401) {
      console.warn("❌ 401 Unauthorized — removing token");
      localStorage.removeItem("token");
    }

    console.error("API ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default axiosInstance;
