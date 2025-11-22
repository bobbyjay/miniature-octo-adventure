// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // prevent double clicks
    if (loading) return;

    setLoading(true);

    try {
      const res = await register(form);

      if (!res.success) {
        setError(res.error || "Registration failed.");
      }
      // success redirect handled in AuthContext
    } catch (err) {
      console.error("Register Error:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1>Create Account</h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
          autoComplete="username"
          style={styles.input}
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
          style={styles.input}
        />

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          required
          autoComplete="new-password"
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 420,
    margin: "40px auto",
    padding: 20,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 12,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 15,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    background: "#111",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
};
