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
     🔵 Helper: Load profile picture blob → URL
  --------------------------------------------------------- */
  const loadProfilePicture = async (userId) => {
    try {
      if (!userId) return;

      const res = await api.getProfilePicture(userId, { responseType: "blob" });

      const imageUrl = URL.createObjectURL(res.data);

      setUser((prev) =>
        prev
          ? { ...prev, profilePictureUrl: imageUrl }
          : prev
      );
    } catch (err) {
      console.warn("Profile picture not found or failed to load");
    }
  };

  /* ---------------------------------------------------------
     🟢 LOAD USER ON REFRESH
  --------------------------------------------------------- */
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();

        if (mounted) {
          const freshUser = res.data?.data || null;
          setUser(freshUser);

          // ⬅️ Load profile picture automatically
          if (freshUser?._id || freshUser?.id) {
            await loadProfilePicture(freshUser._id || freshUser.id);
          }
        }
      } catch (err) {
        const code = err.response?.status;

        if (code === 401) {
          console.warn("⚠️ Token expired — clearing");
          localStorage.removeItem("token");
          if (mounted) setUser(null);
        } else {
          console.warn("⚠️ Non-auth error but keeping token:", code);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();
    return () => (mounted = false);
  }, []);

  /* ---------------------------------------------------------
     REGISTER
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
        localStorage.setItem("token", data.token);

        const newUser = {
          id: data.id,
          username: data.username,
          email: data.email,
          profilePicture: data.profilePicture || null,
        };

        setUser(newUser);

        // Load image after verifying
        await loadProfilePicture(data.id);

        navigate("/dashboard");
      } else {
        navigate("/login");
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Invalid code",
      };
    }
  };

  /* ---------------------------------------------------------
     LOGIN — now loads profile picture
  --------------------------------------------------------- */
  const login = async ({ email, password }) => {
    try {
      const res = await api.login({ email, password });
      const data = res.data.data;

      if (!data?.token) {
        throw new Error("No token returned by backend.");
      }

      localStorage.setItem("token", data.token);

      const loggedInUser = {
        id: data.id,
        email: data.email,
        username: data.username,
        profilePicture: data.profilePicture || null,
      };

      setUser(loggedInUser);

      // ⬅️ Load profile picture immediately after login
      await loadProfilePicture(data.id);

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