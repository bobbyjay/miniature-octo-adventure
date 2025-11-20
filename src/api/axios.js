import axios from "axios";

const api = axios.create({
  baseURL: "https://clutchden.onrender.com/api",
  withCredentials: false,
  timeout: 15000,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("🔐 Sending token:", token);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠ No token found.");
    }

    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn("❌ 401 Unauthorized — clearing token.");
      localStorage.removeItem("token");
    }

    console.error("API Error:", error.response?.data || error.message);

    return Promise.reject(error);
  }
);

export default api;