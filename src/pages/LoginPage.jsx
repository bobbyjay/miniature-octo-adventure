// src/pages/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(form); // AuthContext handles navigation

    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">Login</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p>
        Don’t have an account?
        <Link to="/register"> Register here</Link>
      </p>
    </div>
  );
}