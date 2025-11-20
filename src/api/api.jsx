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
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

/* -----------------------
      AUTH ROUTES
------------------------*/
api.register = (data) => api.post("/auth/register", data);
api.verifyEmail = (data) => api.post("/auth/verify-email", data);
api.resendCode = (data) => api.post("/auth/resend-code", data);
api.login = (data) => api.post("/auth/login", data);

/* -----------------------
      USER ROUTES
------------------------*/
api.getMe = () => api.get("/users/me");
api.updateProfile = (data) => api.put("/users/update-profile", data);
api.updatePassword = (data) => api.put("/users/update-password", data);
api.deleteAccount = (data) => api.delete("/users/delete-account", { data });

/* -----------------------
      WALLET ROUTES
------------------------*/
api.deposit = (data) => api.post("/wallet/deposit", data);
api.withdraw = (data) => api.post("/wallet/withdraw", data);
api.getHistory = () => api.get("/wallet/history");

/* -----------------------
   NOTIFICATION ROUTES
------------------------*/
api.getNotifications = () => api.get("/notifications");
api.markRead = (id) => api.put(`/notifications/read/${id}`);
api.markAllRead = () => api.put("/notifications/read-all");

/* -----------------------
   UPLOAD ROUTES
------------------------*/
api.uploadProfilePicture = (formData) =>
  api.post("/upload/profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* -----------------------
   ADMIN ROUTES
------------------------*/
api.getUsers = () => api.get("/admin/users");
api.disableUser = (userId) => api.put(`/admin/disable/${userId}`);
api.enableUser = (userId) => api.put(`/admin/enable/${userId}`);
api.deleteUser = (userId) => api.delete(`/admin/delete/${userId}`);

/* -----------------------
   SYSTEM ROUTES
------------------------*/
api.health = () => api.get("/health");

export default api;