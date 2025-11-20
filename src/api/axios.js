import axios from "axios";

const api = axios.create({
  baseURL: "https://clutchden.onrender.com/api",
  withCredentials: false,
  timeout: 15000, // prevents hanging forever
});

// REQUEST INTERCEPTOR (adds Bearer token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    const originalRequest = error.config;

    const status = error?.response?.status;

    // --- HANDLE 401 UNAUTHORIZED ---
    if (status === 401) {
      console.warn("Unauthorized: clearing session.");

      // Remove token
      localStorage.removeItem("token");

      // Optional: redirect to login (uncomment if needed)
      // window.location.href = "/signin";
    }

    // Log the error for debug
    console.error("API Error:", error.response?.data || error.message);

    // Reject the error properly
    return Promise.reject(error);
  }
);

export default api;