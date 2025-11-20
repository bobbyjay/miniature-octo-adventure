import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Signup from "./pages/RegisterPage";
import Dashboard from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route path="/signin" element={<Login />} />
        <Route path="/login" element={<Login />} /> {/* fallback */} 

        {/* Signup / Register (both work now) */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} /> {/* fixes your error */}

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}