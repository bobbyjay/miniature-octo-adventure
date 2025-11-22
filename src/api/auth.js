import api from "./axios";

/** Save token */
const saveToken = (token) => {
  localStorage.setItem("token", token);
};

/** Read token */
export const getToken = () => {
  return localStorage.getItem("token");
};

/** Logout */
export const logoutUser = () => {
  localStorage.removeItem("token");
};

/* ---------------------------------------------------------
   LOGIN
--------------------------------------------------------- */
export const loginUser = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });

    if (res.data?.token) {
      saveToken(res.data.token);
    }

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

/* ---------------------------------------------------------
   REGISTER — FIXED: send { username, email, password }
--------------------------------------------------------- */
export const registerUser = async ({ username, email, password }) => {
  try {
    const res = await api.post("/auth/register", {
      username,
      email,
      password,
    });

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Registration failed" };
  }
};

/* ---------------------------------------------------------
   GET PROFILE
--------------------------------------------------------- */
export const getProfile = async () => {
  try {
    const res = await api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      logoutUser();
    }

    throw err.response?.data || { message: "Failed to fetch profile" };
  }
};
