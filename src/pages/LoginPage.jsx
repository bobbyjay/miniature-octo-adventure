// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api"; // <-- IMPORTANT (you were not calling api.login)

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔥 Call real backend login API
      const res = await api.login(form);

      if (!res.data?.success) {
        setLoading(false);
        setError(res.data?.message || "Login failed");
        return;
      }

      const user = res.data.data;

      // 🔥 Save token correctly
      localStorage.setItem("token", `Bearer ${user.token}`);

      // 🔥 Save user info for Dashboard
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);

      // 🔥 Update AuthContext (your existing setup)
      login({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      setLoading(false);
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome Back</h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p style={styles.text}>
        Don’t have an account?{" "}
        <span style={styles.link} onClick={() => navigate("/signup")}>
          Sign Up
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    paddingTop: "60px",
    textAlign: "center",
  },
  title: {
    fontSize: "30px",
    marginBottom: "20px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "10px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    background: "#111",
    color: "#fff",
    fontSize: "17px",
    cursor: "pointer",
    border: "none",
  },
  text: {
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#007bff",
    cursor: "pointer",
    marginLeft: "5px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};