import { Routes, Route } from "react-router-dom";

import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Signup from "./pages/RegisterPage";
import Dashboard from "./pages/DashboardPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

export default function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route path="/signin" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Signup */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Signup />} />

      {/* Email Verification */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}