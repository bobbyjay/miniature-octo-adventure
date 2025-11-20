// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://clutchden.onrender.com/api";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  /* --------------------------------------------------
     DASHBOARD LOADING
  -------------------------------------------------- */
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setError("Please login to continue.");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);

        const userId = user?.id;
        if (!userId) {
          setError("Failed to load user data.");
          setLoading(false);
          return;
        }

        const [profileRes, pictureRes, balanceRes, txRes, notifRes] =
          await Promise.allSettled([
            api.getProfile(userId),
            api.getAuthenticatedProfilePicture(),
            api.getBalance(),
            api.transactions(),
            api.getNotifications(),
          ]);

        /* ---------------------------------------
           USER PROFILE
        --------------------------------------- */
        if (profileRes.status === "fulfilled") {
          const data = profileRes.value.data?.data || null;
          setProfile(data);
        }

        /* ---------------------------------------
           PROFILE PICTURE (stream blob → url)
        --------------------------------------- */
        if (pictureRes.status === "fulfilled") {
          const blob = pictureRes.value.data;
          const imageUrl = URL.createObjectURL(blob);
          setProfilePicUrl(imageUrl);
        }

        /* ---------------------------------------
           BALANCE
        --------------------------------------- */
        if (balanceRes.status === "fulfilled") {
          setBalance(balanceRes.value.data?.data?.balance || 0);
        }

        /* ---------------------------------------
           TRANSACTIONS (Guaranteed to always be an array)
        --------------------------------------- */
        if (txRes.status === "fulfilled") {
          let tx = txRes.value?.data?.data;

          if (!Array.isArray(tx)) {
            console.warn("⚠ Backend returned invalid transactions:", tx);
            tx = [];
          }

          setTransactions(tx);
        } else {
          console.warn("⚠ Transactions request failed:", txRes.reason);
          setTransactions([]); // fallback
        }

        /* ---------------------------------------
           NOTIFICATIONS
        --------------------------------------- */
        if (notifRes.status === "fulfilled") {
          const data = notifRes.value.data?.data;
          setNotifications(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authLoading, isAuthenticated, user?.id]);

  /* ---------------------------------------
     UI
  --------------------------------------- */
  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>
      {/* HEADER */}
      <header style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <img
          src={profilePicUrl || "/default-avatar.png"}
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            objectFit: "cover",
            background: "#ddd",
          }}
          alt="Avatar"
        />

        <div>
          <h1 style={{ margin: 0 }}>{profile?.username}</h1>
          <div>{profile?.email}</div>
        </div>

        {/* BALANCE */}
        <div style={{ marginLeft: "auto", fontSize: 20 }}>
          Balance: ₦{balance.toLocaleString()}
        </div>
      </header>

      {/* TRANSACTIONS */}
      <section style={{ marginTop: 30 }}>
        <h2>Transaction History</h2>

        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul>
            {transactions.map((t) => (
              <li key={t._id}>
                {t.type?.toUpperCase()} — ₦{t.amount} — {t.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* NOTIFICATIONS */}
      <section style={{ marginTop: 30 }}>
        <h2>Notifications</h2>

        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n._id}>{n.message}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}