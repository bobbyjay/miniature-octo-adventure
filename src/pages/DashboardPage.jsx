// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [walletHistory, setWalletHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    if (authLoading) return; // wait for auth to initialize
    if (!isAuthenticated) {
      setLoading(false);
      setError("You must be logged in to view the dashboard.");
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError("");

        // fetch user profile is already available in AuthContext; fetch wallet history + notifications
        const [walletRes, notifRes] = await Promise.allSettled([
          api.getWalletHistory(),
          api.getNotifications(),
        ]);

        if (!mounted) return;

        if (walletRes.status === "fulfilled") {
          setWalletHistory(walletRes.value.data || []);
        } else {
          console.warn("Wallet history failed:", walletRes.reason);
        }

        if (notifRes.status === "fulfilled") {
          setNotifications(notifRes.value.data || []);
        } else {
          console.warn("Notifications failed:", notifRes.reason);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 980, margin: "24px auto", padding: 16 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h1>Welcome, {user?.username || user?.email}</h1>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div>{user?.email}</div>
        </div>
      </header>

      <section style={{ marginTop: 24 }}>
        <h2>Wallet history</h2>
        {walletHistory.length === 0 ? (
          <p>No wallet history</p>
        ) : (
          <ul>
            {walletHistory.map((t) => (
              <li key={t.id || JSON.stringify(t)}>
                {t.type || t.action} — {t.amount} — {t.date || t.createdAt}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n.id}>{n.message || n.title}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}