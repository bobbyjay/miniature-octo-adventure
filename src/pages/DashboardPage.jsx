// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const API_BASE = import.meta.env.VITE_API_BASE || "https://clutchden.onrender.com/api";

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
      setError("Please login to continue.");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);

        // 🔥 Make sure userId always exists
        const userId = user?.id || localStorage.getItem("userId");
        if (!userId) {
          setError("User ID missing. Please login again.");
          setLoading(false);
          return;
        }

        const [
          profileRes,
          picRes,
          balanceRes,
          txRes,
          notifRes,
        ] = await Promise.allSettled([
          api.getProfile(userId),
          api.getMyProfilePic(),
          api.getBalance(),
          api.transactions(),
          api.getNotifications(),
        ]);

        /* ---------------------------------------------------------
           USER PROFILE
        --------------------------------------------------------- */
        if (profileRes.status === "fulfilled") {
          const p = profileRes.value.data?.data;
          setProfile(p || null);
          localStorage.setItem("userId", p?.id); // ensure persistence
        } else {
          console.warn("Profile failed:", profileRes.reason);
        }

        /* ---------------------------------------------------------
           PROFILE PICTURE (must convert relative → absolute URL)
        --------------------------------------------------------- */
        if (picRes.status === "fulfilled") {
          const arr = picRes.value.data?.data;

          if (Array.isArray(arr) && arr.length > 0) {
            let streamUrl = arr[0].streamUrl || "";

            // build full URL
            if (streamUrl.startsWith("/")) {
              streamUrl = API_BASE + streamUrl; // ➜ https://domain/api/users/id/profile-picture
            } else {
              streamUrl = `${API_BASE}/${streamUrl}`;
            }

            setProfilePicUrl(streamUrl);
          }
        } else {
          console.warn("Profile picture failed:", picRes.reason);
        }

        /* ---------------------------------------------------------
           BALANCE
        --------------------------------------------------------- */
        if (balanceRes.status === "fulfilled") {
          setBalance(balanceRes.value.data?.data?.balance || 0);
        }

        /* ---------------------------------------------------------
           TRANSACTIONS
        --------------------------------------------------------- */
        if (txRes.status === "fulfilled") {
          const list = txRes.value.data?.data;
          setTransactions(Array.isArray(list) ? list : []);
        }

        /* ---------------------------------------------------------
           NOTIFICATIONS
        --------------------------------------------------------- */
        if (notifRes.status === "fulfilled") {
          const list = notifRes.value.data?.data;
          setNotifications(Array.isArray(list) ? list : []);
        }

      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authLoading, isAuthenticated]);

  /* ---------------------------------------------------------
     RENDER UI
  --------------------------------------------------------- */
  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>

      {/* HEADER */}
      <header style={{ display: "flex", gap: 16, alignItems: "center" }}>

        {/* PROFILE PICTURE */}
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

        {/* USER INFO */}
        <div>
          <h1 style={{ margin: 0 }}>{profile?.username}</h1>
          <div>{profile?.email}</div>
        </div>

        {/* BALANCE */}
        <div style={{ marginLeft: "auto", fontSize: 20 }}>
          Balance: ${balance.toLocaleString()}
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