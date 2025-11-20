import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

    const res = await register(form);

    setLoading(false);

    if (!res.success) {
      setError(res.error);
      return;
    }

    // Redirect done inside AuthContext (navigate to /verify-email)
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create Account</h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
          required
        />

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
          placeholder="Create Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p style={styles.loginText}>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} style={styles.link}>
          Login
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
  title: { fontSize: "28px", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
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
  },
  error: { color: "red", marginBottom: "10px" },
  loginText: { marginTop: "15px" },
  link: { color: "#007bff", cursor: "pointer" },
};