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
      if (!token) return setLoading(false);

      try {
        const res = await api.getMe();
        setUser(res.data.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // ----------------------------
  // REGISTER
  // ----------------------------
  const register = async (formData) => {
    try {
      await api.register(formData);

      // Save email for verification step
      setPendingEmail(formData.email);

      // Redirect to verification page
      navigate("/verify-email");

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // ----------------------------
  // VERIFY EMAIL
  // ----------------------------
  const verifyEmail = async (code) => {
    try {
      const res = await api.verifyEmail({
        email: pendingEmail,
        code: code,
      });

      // Backend returns token + user
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      navigate("/dashboard");

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Invalid verification code",
      };
    }
  };

  // ----------------------------
  // LOGIN
  // ----------------------------
  const login = async (formData) => {
    try {
      const res = await api.login(formData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
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