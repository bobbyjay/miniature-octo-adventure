import { Routes, Route } from "react-router-dom";

import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Signup from "./pages/RegisterPage";
import Dashboard from "./pages/DashboardPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route path="/signin" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Signup / Register */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Signup />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}