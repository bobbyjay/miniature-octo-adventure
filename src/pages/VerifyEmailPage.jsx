// src/pages/VerifyEmailPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmailPage() {
  const { verifyEmail, pendingEmail } = useAuth();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!pendingEmail) {
      setMsg("No pending email. Please register first.");
      return;
    }

    if (code.trim().length !== 6) {
      setMsg("Enter 6-digit code.");
      return;
    }

    setLoading(true);
    const res = await verifyEmail(code);
    setLoading(false);

    if (!res.success) {
      setMsg(res.error);
    } else {
      setMsg("Verified! Redirecting...");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Verify your email</h1>
      <p>Code sent to: <strong>{pendingEmail || "—"}</strong></p>

      {msg && <p style={styles.msg}>{msg}</p>}

      <form onSubmit={submit} style={styles.form}>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" maxLength={6} style={styles.input} />
        <button style={styles.button} disabled={loading}>{loading ? "Verifying..." : "Verify"}</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: 420, margin: "40px auto", padding: 20, textAlign: "center" },
  form: { display: "flex", gap: 8, marginTop: 12, justifyContent: "center" },
  input: { padding: 10, width: 160, borderRadius: 8, border: "1px solid #ddd", textAlign: "center" },
  button: { padding: 10, borderRadius: 8, background: "#111", color: "#fff", border: "none" },
  msg: { color: "red" }
};