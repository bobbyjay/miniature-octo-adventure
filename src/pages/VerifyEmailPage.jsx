import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function VerifyEmailPage() {
  const { verifyEmail, pendingEmail } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess("");

    if (code.trim().length !== 6) {
      setMessage("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    const res = await verifyEmail(code);

    setLoading(false);

    if (!res.success) {
      setMessage(res.error);
      return;
    }

    setSuccess("Email verified! Redirecting...");
    setTimeout(() => navigate("/dashboard"), 800);
  };

  // If user refreshes and pendingEmail is gone
  if (!pendingEmail) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>No Email Found</h2>
        <p style={styles.text}>Please register again.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Verify Your Email</h1>

      <p style={styles.text}>A verification code was sent to:</p>
      <b style={styles.email}>{pendingEmail}</b>

      {message && <p style={styles.error}>{message}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={submit} style={styles.form}>
        <input
          type="text"
          maxLength="6"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <p style={styles.resendText}>
        Didn’t receive a code?{" "}
        <span style={styles.link}>Resend</span>
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
    fontSize: "28px",
    marginBottom: "10px",
    fontWeight: "600",
  },
  email: {
    display: "block",
    marginBottom: "20px",
    fontSize: "16px",
  },
  text: {
    marginBottom: "5px",
    fontSize: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "18px",
    textAlign: "center",
    letterSpacing: "3px",
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
  resendText: {
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
  success: {
    color: "green",
    marginBottom: "10px",
  },
};