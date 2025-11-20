// src/pages/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(form);
    setLoading(false);

    if (!res.success) {
      setError(res.error);
    }
    // on success AuthContext navigates to /dashboard
  };

  return (
    <div style={styles.container}>
      <h1>Sign In</h1>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={submit} style={styles.form}>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required style={styles.input} />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required style={styles.input} />
        <button style={styles.button} disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
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