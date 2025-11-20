// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [walletHistory, setWalletHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      setError("You must be logged in to view the dashboard.");
      return;
    }

    async function loadDashboard() {
      try {
        setLoading(true);

        // Load everything in parallel
        const [me, wallet, notifs] = await Promise.allSettled([
          api.getMe(), // returns user profile
          api.walletHistory(), // returns list of transactions
          api.getNotifications(), // returns list of notifications
        ]);

        // --------------------------
        // Profile
        // --------------------------
        if (me.status === "fulfilled") {
          setProfile(me.value.data);
        } else {
          console.warn("Profile load failed:", me.reason);
        }

        // --------------------------
        // Wallet + Balance
        // --------------------------
        if (wallet.status === "fulfilled") {
          const history = wallet.value.data || [];
          setWalletHistory(history);

          const total = history.reduce((sum, tx) => {
            if (tx.type === "deposit") return sum + tx.amount;
            if (tx.type === "withdraw") return sum - tx.amount;
            return sum;
          }, 0);

          setBalance(total);
        } else {
          console.warn("Wallet load failed:", wallet.reason);
        }

        // --------------------------
        // Notifications
        // --------------------------
        if (notifs.status === "fulfilled") {
          setNotifications(notifs.value.data || []);
        } else {
          console.warn("Notifications load failed:", notifs.reason);
        }
      } catch (e) {
        console.error("Dashboard load failed:", e);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 20 }}>
      {/* ---------------------- */}
      {/* USER PROFILE HEADER   */}
      {/* ---------------------- */}
      <header style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <img
          src={profile?.profilePicture || "/default-avatar.png"}
          alt="Profile"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #ddd",
          }}
        />

        <div>
          <h2 style={{ margin: 0 }}>{profile?.username}</h2>
          <div>{profile?.email}</div>
          <div style={{ marginTop: 5, fontWeight: "bold" }}>
            Balance: ₦{balance.toLocaleString()}
          </div>
        </div>
      </header>

      {/* ---------------------- */}
      {/* WALLET HISTORY         */}
      {/* ---------------------- */}
      <section style={{ marginTop: 30 }}>
        <h3>Wallet History</h3>

        {walletHistory.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul>
            {walletHistory.map((tx) => (
              <li key={tx._id || Math.random()}>
                <b>{tx.type.toUpperCase()}</b> — ₦{tx.amount.toLocaleString()}  
                <span style={{ marginLeft: 8, opacity: 0.6 }}>
                  {new Date(tx.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------------------- */}
      {/* NOTIFICATIONS          */}
      {/* ---------------------- */}
      <section style={{ marginTop: 30 }}>
        <h3>Notifications</h3>

        {notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n._id} style={{ opacity: n.read ? 0.6 : 1 }}>
                {n.message}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}