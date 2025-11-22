// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { 
  registerUser,
  loginUser,
  getProfile 
} from "../api/auth";

import { 
  getMe,
  getProfilePicture 
} from "../api/users";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------------
     🔵 Load profile picture BLOB → URL
  --------------------------------------------------------- */
  const loadProfilePicture = async (userId) => {
    try {
      if (!userId) return;

      const res = await getProfilePicture(userId, {
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(res.data);

      setUser((prev) =>
        prev ? { ...prev, profilePictureUrl: imageUrl } : prev
      );
    } catch (err) {
      console.warn("Profile picture missing or failed to load");
    }
  };

  /* ---------------------------------------------------------
     🟢 Load logged-in user on refresh
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
        const res = await getMe();
        const freshUser = res.data?.data || null;

        if (mounted) {
          setUser(freshUser);

          if (freshUser?._id || freshUser?.id) {
            await loadProfilePicture(freshUser._id || freshUser.id);
          }
        }
      } catch (err) {
        if (err.response?.status === 401) {
          console.warn("⚠️ Token expired — clearing");
          localStorage.removeItem("token");
          if (mounted) setUser(null);
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
      await registerUser({ username, email, password });

      setPendingEmail(email);
      navigate("/verify-email");

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || err.response?.data?.message || "Registration failed",
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
     LOGIN
  --------------------------------------------------------- */
  const login = async ({ email, password }) => {
    try {
      const res = await loginUser(email, password);
      const data = res.data;

      if (!data?.token) throw new Error("No token returned by backend");

      localStorage.setItem("token", data.token);

      const loggedInUser = {
        id: data.id,
        email: data.email,
        username: data.username,
        profilePicture: data.profilePicture || null,
      };

      setUser(loggedInUser);

      await loadProfilePicture(data.id);

      navigate("/dashboard");

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Login failed",
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
