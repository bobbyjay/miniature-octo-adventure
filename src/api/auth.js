import api from "./axios";

/**
 * Save token to browser storage
 */
const saveToken = (token) => {
  localStorage.setItem("token", token);
};

/**
 * Read token
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Remove token on logout
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
};


/**
 * LOGIN — returns token & stores it
 */
export const loginUser = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });

    if (res.data?.token) {
      saveToken(res.data.token); // store the token
    }

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};


/**
 * REGISTER
 */
export const registerUser = async (email, password, name) => {
  try {
    const res = await api.post("/auth/register", { email, password, name });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Registration failed" };
  }
};


/**
 * GET PROFILE — requires token
 */
export const getProfile = async () => {
  try {
    const res = await api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.data;
  } catch (err) {
    // auto logout if token is invalid/expired
    if (err.response?.status === 401) {
      logoutUser();
    }

    throw err.response?.data || { message: "Failed to fetch profile" };
  }
};