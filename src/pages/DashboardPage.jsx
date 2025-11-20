import { useEffect, useState } from "react";
import { getUserData } from "../api/user";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    async function loadUser() {
      const data = await getUserData(token);

      setUserInfo({
        profilePicture: data.profilePicture.url,
        bets: data.bets,
        events: data.events,
        transactions: data.transactions,
        notifications: data.notifications
      });
    }

    loadUser();
  }, [token, navigate]);

  if (!userInfo) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h2>Your Dashboard</h2>

      <div className="user-header">
        <img src={userInfo.profilePicture} alt="Profile"/>
        <p>Balance: ${userInfo.transactions.balance}</p>
      </div>

      <h3>Notifications</h3>
      <ul>
        {userInfo.notifications.map((n) => (
          <li key={n.id}>{n.message}</li>
        ))}
      </ul>

      <h3>Your Bets</h3>
      <ul>
        {userInfo.bets.map((b) => (
          <li key={b.id}>{b.event} — {b.amount}</li>
        ))}
      </ul>

      <h3>Upcoming Events</h3>
      <ul>
        {userInfo.events.map((e) => (
          <li key={e.id}>{e.name}</li>
        ))}
      </ul>
    </div>
  );
}