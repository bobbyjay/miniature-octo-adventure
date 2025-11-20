import React, { useEffect, useState } from "react";
import { api } from "../api/api";

export default function NotificationsPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getNotifications();
      setNotes(res.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await api.readNotification(id);
      load();
    } catch (err) {
      alert("Could not mark notification as read");
    }
  };

  const markAll = async () => {
    try {
      await api.readAllNotifications();
      load();
    } catch (err) {
      alert("Could not mark all notifications");
    }
  };

  return (
    <div className="mt-8 max-w-lg">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>

      <div className="mb-3">
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={markAll}>
          Mark all read
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {!loading && notes.length === 0 && <div>No notifications</div>}

      <ul className="space-y-2">
        {notes.map((n) => (
          <li key={n._id || n.id} className={`p-3 border rounded ${n.read ? "opacity-60" : ""}`}>
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="font-semibold">{n.title || "Notification"}</div>
                <div className="text-sm">{n.message || JSON.stringify(n)}</div>
              </div>
              {!n.read && (
                <button className="px-2 py-1 rounded bg-green-600 text-white" onClick={() => markRead(n._id || n.id)}>
                  Mark
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}