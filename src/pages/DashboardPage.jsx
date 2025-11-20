import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profilePic, setProfilePic] = useState(null);
  const [bets, setBets] = useState([]);
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    // Wait until AuthContext finishes loading
    if (authLoading) return;

    // If no user → redirect is already handled by AuthContext
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          profileRes,
          betsRes,
          eventsRes,
          transactionsRes,
          notificationsRes,
        ] = await Promise.all([
          api.get("/users/profile-pictures"),
          api.get("/bets"),
          api.get("/events"),
          api.get("/account/transactions"),
          api.get("/notifications"),
        ]);

        if (!mounted) return;

        setProfilePic(profileRes.data?.url || null);
        setBets(betsRes.data || []);
        setEvents(eventsRes.data || []);
        setTransactions(transactionsRes.data || []);
        setNotifications(notificationsRes.data || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load your dashboard.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [authLoading, isAuthenticated]);

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (authLoading || loading) {
    return <div className="dashboard-loading">Loading your account...</div>;
  }

  // -----------------------------
  // ERROR STATE
  // -----------------------------
  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  // -----------------------------
  // DASHBOARD UI
  // -----------------------------
  return (
    <div className="dashboard">
      <section className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        {profilePic && (
          <img src={profilePic} alt="Profile" className="profile-pic" />
        )}
      </section>

      {/* NOTIFICATIONS */}
      <section className="dashboard-section">
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n.id}>{n.message}</li>
            ))}
          </ul>
        )}
      </section>

      {/* BETS */}
      <section className="dashboard-section">
        <h2>Your Bets</h2>
        {bets.length === 0 ? (
          <p>You have no active bets</p>
        ) : (
          <ul>
            {bets.map((b) => (
              <li key={b.id}>
                {b.eventName} — {b.amount} — Status: {b.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* EVENTS */}
      <section className="dashboard-section">
        <h2>Upcoming Events</h2>
        {events.length === 0 ? (
          <p>No upcoming events</p>
        ) : (
          <ul>
            {events.map((e) => (
              <li key={e.id}>
                {e.name} — {e.date}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* TRANSACTIONS */}
      <section className="dashboard-section">
        <h2>Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions available</p>
        ) : (
          <ul>
            {transactions.map((t) => (
              <li key={t.id}>
                {t.type} — ${t.amount} — {t.date}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}