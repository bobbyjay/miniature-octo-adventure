import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmailPage() {
  const { verifyEmail, pendingEmail } = useAuth();

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const res = await verifyEmail(code);

    if (!res.success) {
      setMessage(res.error);
    }
  };

  if (!pendingEmail) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No email found</h2>
        <p>Please register again.</p>
      </div>
    );
  }

  return (
    <div className="verify-container">
      <h2>Verify Your Email</h2>
      <p>A verification code was sent to:</p>
      <b>{pendingEmail}</b>

      <form onSubmit={submit}>
        <input
          type="text"
          maxLength="6"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button type="submit">Verify</button>
      </form>

      {message && <p className="error">{message}</p>}
    </div>
  );
}