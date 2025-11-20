// src/api/index.js
import axios from "./axios";

// AUTH
const register = (payload) => axios.post("/auth/register", payload);
const verifyEmail = (payload) => axios.post("/auth/verify-email", payload);
const resendCode = (payload) => axios.post("/auth/resend-code", payload);
const login = (payload) => axios.post("/auth/login", payload);

// USER
const getMe = () => axios.get("/users/me");
const updateProfile = (payload) => axios.put("/users/update-profile", payload);
const updatePassword = (payload) => axios.put("/users/update-password", payload);
const deleteAccount = (payload) =>
  axios.delete("/users/delete-account", { data: payload });

// WALLET
const deposit = (payload) => axios.post("/wallet/deposit", payload);
const withdraw = (payload) => axios.post("/wallet/withdraw", payload);
const getWalletHistory = () => axios.get("/wallet/history");

// NOTIFICATIONS
const getNotifications = () => axios.get("/notifications");
const markNotificationRead = (id) => axios.put(`/notifications/read/${id}`);
const markAllNotificationsRead = () => axios.put("/notifications/read-all");

// UPLOADS
const uploadProfilePicture = (formData) =>
  axios.post("/upload/profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ADMIN
const getUsers = () => axios.get("/admin/users");
const disableUser = (userId) => axios.put(`/admin/disable/${userId}`);
const enableUser = (userId) => axios.put(`/admin/enable/${userId}`);
const deleteUser = (userId) => axios.delete(`/admin/delete/${userId}`);

// SYSTEM
const health = () => axios.get("/health");

export default {
  // axios instance (for advanced use)
  raw: axios,

  // auth
  register,
  verifyEmail,
  resendCode,
  login,

  // user
  getMe,
  updateProfile,
  updatePassword,
  deleteAccount,

  // wallet
  deposit,
  withdraw,
  getWalletHistory,

  // notifications
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,

  // upload
  uploadProfilePicture,

  // admin
  getUsers,
  disableUser,
  enableUser,
  deleteUser,

  // system
  health,
};