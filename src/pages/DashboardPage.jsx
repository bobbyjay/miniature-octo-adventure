// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setError("You must be logged in to view this page.");
      setLoading(false);
      return;
    }

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const userId = localStorage.getItem("userId") || user?.id;

        if (!userId) {
          setError("No user ID found. Please login again.");
          setLoading(false);
          return;
        }

        // ---- PARALLEL REQUESTS ----
        const [
          profileRes,
          balanceRes,
          txRes,
          notifRes,
          profilePicRes,
        ] = await Promise.allSettled([
          api.getMe(), // /users/profile/:id
          api.getBalance(), // /account/balance
          api.transactions(), // /account/transactions
          api.getNotifications(), // safe fallback included
          api.getMyProfilePic(), // /users/profile-picture
        ]);

        // ---- PROFILE ----
        if (profileRes.status === "fulfilled") {
          setProfile(profileRes.value.data);
        } else {
          console.warn("Profile load failed:", profileRes.reason);
        }

        // ---- BALANCE ----
        if (balanceRes.status === "fulfilled") {
          setBalance(balanceRes.value.data.balance || 0);
        } else {
          console.warn("Balance failed:", balanceRes.reason);
        }

        // ---- TRANSACTIONS ----
        if (txRes.status === "fulfilled") {
          setTransactions(txRes.value.data || []);
        } else {
          console.warn("Transactions failed:", txRes.reason);
        }

        // ---- NOTIFICATIONS ----
        if (notifRes.status === "fulfilled") {
          const data = notifRes.value.data;
          setNotifications(Array.isArray(data) ? data : []);
        } else {
          console.warn("Notifications failed:", notifRes.reason);
          setNotifications([]); // prevent crash
        }

        // ---- PROFILE PICTURE ----
        if (profilePicRes.status === "fulfilled") {
          const blob = profilePicRes.value.data;
          setProfilePicUrl(URL.createObjectURL(blob));
        } else {
          console.warn("Profile picture failed:", profilePicRes.reason);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [authLoading, isAuthenticated]);

  // ---- LOADING / ERRORS ----
  if (authLoading || loading) return <div>Loading dashboard…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>
      {/* HEADER */}
      <header style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img
          src={profilePicUrl || "/default-avatar.png"}
          alt="Profile"
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            objectFit: "cover",
            background: "#ddd",
          }}
        />

        <div>
          <h1 style={{ margin: 0 }}>
            Welcome, {profile?.username || user?.username}
          </h1>
          <div>{profile?.email || user?.email}</div>
        </div>

        <div style={{ marginLeft: "auto", fontSize: 20, fontWeight: "bold" }}>
          Balance: ₦{balance.toLocaleString()}
        </div>
      </header>

      {/* TRANSACTIONS */}
      <section style={{ marginTop: 30 }}>
        <h2>Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul>
            {transactions.map((tx) => (
              <li key={tx.id || tx._id}>
                {tx.type.toUpperCase()} — ₦{tx.amount.toLocaleString()} —{" "}
                {tx.status} — {new Date(tx.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* NOTIFICATIONS */}
      <section style={{ marginTop: 30 }}>
        <h2>Notifications</h2>

        {notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n._id || n.id}>
                {n.title || "Notification"} — {n.message}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}