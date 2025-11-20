import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState(null);

  // Load user on refresh
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getMe(); // FIXED ROUTE
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  /* -------------------------
        REGISTER
  --------------------------*/
  const register = async (formData) => {
    try {
      await api.register({
        username: formData.username,   // backend requires "username"
        email: formData.email,
        password: formData.password,
      });

      setPendingEmail(formData.email);
      navigate("/verify-email");

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed",
      };
    }
  };

  /* -------------------------
        VERIFY EMAIL
  --------------------------*/
  const verifyEmail = async (code) => {
    try {
      const res = await api.verifyEmail({
        email: pendingEmail,
        code,
      });

      localStorage.setItem("token", res.data.token);

      setUser({
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
      });

      navigate("/dashboard");

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Invalid verification code",
      };
    }
  };

  /* -------------------------
          LOGIN
  --------------------------*/
  const login = async (formData) => {
    try {
      const res = await api.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);

      setUser({
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
      });

      navigate("/dashboard");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  /* -------------------------
          LOGOUT
  --------------------------*/
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        pendingEmail,
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