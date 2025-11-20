// src/pages/BetsPage.jsx
import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function BetsPage() {
  const { user } = useAuth();

  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch bets
  const loadBets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bets");
      setBets(res.data.bets || []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to load bets. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBets();
  }, []);

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1>My Bets</h1>

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Loading */}
      {loading ? (
        <p>Loading bets...</p>
      ) : bets.length === 0 ? (
        <p>You have no bets placed yet.</p>
      ) : (
        <div className="bet-list">
          {bets.map((bet) => (
            <div key={bet._id} className="bet-card">
              <h3>{bet.eventName}</h3>

              <p>
                <strong>Amount:</strong> ${bet.amount}
              </p>

              <p>
                <strong>Pick:</strong> {bet.pick}
              </p>

              <p>
                <strong>Odds:</strong> {bet.odds}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      bet.status === "won"
                        ? "green"
                        : bet.status === "lost"
                        ? "red"
                        : "orange",
                  }}
                >
                  {bet.status?.toUpperCase() || "PENDING"}
                </span>
              </p>

              <p style={{ fontSize: "14px", opacity: 0.7 }}>
                Placed: {new Date(bet.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Styles */}
      <style>{`
        .bet-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 15px;
        }
        .bet-card {
          padding: 16px;
          border-radius: 8px;
          background: #1e1e1e;
          color: #fff;
          border: 1px solid #333;
        }
        .container {
          max-width: 900px;
          margin: auto;
        }
      `}</style>
    </div>
  );
}