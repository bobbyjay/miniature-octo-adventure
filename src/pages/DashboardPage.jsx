// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Data states
  const [profile, setProfile] = useState(null);
  const [walletHistory, setWalletHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [balance, setBalance] = useState(0);
  const [bets, setBets] = useState([]);       // placeholder
  const [events, setEvents] = useState([]);   // placeholder

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setError("You must be logged in to view the dashboard.");
      setLoading(false);
      return;
    }

    async function loadDashboard() {
      try {
        setLoading(true);

        // Load profile, wallet, notifications
        const [me, wallet, notifs] = await Promise.all([
          api.getMe(),              // GET /api/users/me
          api.walletHistory(),      // GET /api/wallet/history
          api.getNotifications(),   // GET /api/notifications
        ]);

        // Profile
        setProfile(me.data?.data || me.data);

        // Account balance
        setBalance(me.data?.data?.balance || 0);

        // Wallet history
        setWalletHistory(wallet.data?.data || []);

        // Notifications
        setNotifications(notifs.data?.data || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 980, margin: "24px auto", padding: 16 }}>

      {/* PROFILE HEADER */}
      <header style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img
          src={profile?.profilePicture || "/default-avatar.png"}
          alt="Profile"
          width={80}
          height={80}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />

        <div>
          <h1>Welcome, {profile?.username}</h1>
          <div>{profile?.email}</div>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <strong>Balance: </strong> ₦{balance.toLocaleString()}
        </div>
      </header>

      {/* WALLET HISTORY */}
      <section style={{ marginTop: 32 }}>
        <h2>Wallet Transaction History</h2>
        {walletHistory.length === 0 ? (
          <p>No wallet history found</p>
        ) : (
          <ul>
            {walletHistory.map((t) => (
              <li key={t.id}>
                <strong>{t.type}</strong> — ₦{t.amount} — {t.createdAt}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* NOTIFICATIONS */}
      <section style={{ marginTop: 32 }}>
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n.id}>
                {n.message}
                {!n.read && (
                  <span style={{ color: "red", marginLeft: 10 }}>
                    ● unread
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* BETS (placeholder until API ready) */}
      <section style={{ marginTop: 32 }}>
        <h2>Your Bets</h2>
        <p>(Coming soon — waiting for bets API)</p>
      </section>

      {/* EVENTS (placeholder until API ready) */}
      <section style={{ marginTop: 32 }}>
        <h2>Upcoming Events</h2>
        <p>(Coming soon — waiting for events API)</p>
      </section>
    </div>
  );
}