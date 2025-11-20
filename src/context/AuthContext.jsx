// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------------
     LOAD USER ON REFRESH
  --------------------------------------------------------- */
  useEffect(() => {
    let mounted = true;

    async function load() {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();

        if (mounted) setUser(res.data.data);
      } catch (err) {
        console.warn("❌ Failed to load user — clearing token");
        localStorage.removeItem("token");
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  /* ---------------------------------------------------------
     REGISTER USER
  --------------------------------------------------------- */
  const register = async ({ username, email, password }) => {
    try {
      await api.register({ username, email, password });

      setPendingEmail(email);
      navigate("/verify-email");

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed",
      };
    }
  };

  /* ---------------------------------------------------------
     VERIFY EMAIL
  --------------------------------------------------------- */
  const verifyEmail = async (code) => {
    try {
      const res = await api.verifyEmail({
        email: pendingEmail,
        code,
      });

      const data = res.data.data;

      if (data?.token) {
        // 🔥 FIXED — store RAW token (NO Bearer)
        localStorage.setItem("token", data.token);

        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
        });

        navigate("/dashboard");
      } else {
        navigate("/login");
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Invalid verification code",
      };
    }
  };

  /* ---------------------------------------------------------
     LOGIN USER
  --------------------------------------------------------- */
  const login = async ({ email, password }) => {
    try {
      const res = await api.login({ email, password });
      const data = res.data.data;

      if (!data?.token) {
        throw new Error("No token returned by backend.");
      }

      // 🔥 FIX — Store RAW JWT token
      localStorage.setItem("token", data.token);

      setUser({
        id: data.id,
        email: data.email,
        username: data.username,
      });

      navigate("/dashboard");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.message ||
          err.message ||
          "Login failed",
      };
    }
  };

  /* ---------------------------------------------------------
     LOGOUT
  --------------------------------------------------------- */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        pendingEmail,
        loading,
        register,
        verifyEmail,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}