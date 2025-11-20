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

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await register(form);
    setLoading(false);

    if (!res.success) {
      setError(res.error);
    }
    // success navigates inside AuthContext to /verify-email
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
          style={styles.input}
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
          style={styles.input}
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          required
          style={styles.input}
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: 420, margin: "40px auto", padding: 20, textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: 12, marginTop: 12 },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ddd" },
  button: { padding: 12, borderRadius: 8, background: "#111", color: "#fff", border: "none" },
  error: { color: "red" },
};