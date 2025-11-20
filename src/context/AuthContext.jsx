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

  // on mount, if token exists, validate with /users/me
  useEffect(() => {
    let mounted = true;

    async function load() {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        // api.getMe() calls /users/me
        const res = await api.getMe();
        // spec says GET /api/users/me returns profile — we'll assume res.data contains user object
        if (mounted) setUser(res.data);
      } catch (err) {
        console.warn("Failed to load user; clearing token");
        localStorage.removeItem("token");
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // register expects { username, email, password }
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

  // verify-email expects { email, code }
  // backend unclear whether it returns token — handle both cases:
  const verifyEmail = async (code) => {
    try {
      const res = await api.verifyEmail({ email: pendingEmail, code });

      // some backends return token/user here; spec didn't explicitly say but login returns token.
      // handle both: if res.data.token exists, store and set user; otherwise navigate to login.
      const payload = res.data || {};

      if (payload.token) {
        // token might already include "Bearer " prefix
        localStorage.setItem("token", payload.token);
        setUser({
          id: payload.id,
          username: payload.username,
          email: payload.email,
        });
        navigate("/dashboard");
      } else {
        // If verify endpoint doesn't return token, send user to login page
        navigate("/login");
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Verification failed",
      };
    }
  };

  // login: backend returns { id, email, username, token }
  const login = async ({ email, password }) => {
    try {
      const res = await api.login({ email, password });
      const payload = res.data;

      // backend returns token as "Bearer ..." per your spec — store exactly as provided
      if (!payload?.token) {
        throw new Error("No token in login response");
      }

      localStorage.setItem("token", payload.token);
      setUser({
        id: payload.id,
        username: payload.username,
        email: payload.email,
      });

      navigate("/dashboard");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message || "Login failed",
      };
    }
  };

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
        login,
        register,
        verifyEmail,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}