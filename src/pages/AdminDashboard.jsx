import React, { useEffect, useState } from "react";
import { api } from "../api/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.adminUsers();
      setUsers(res.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const disable = async (id) => {
    if (!confirm("Disable this user?")) return;
    try {
      await api.adminDisable(id);
      load();
    } catch (err) {
      alert("Could not disable user");
    }
  };

  const enable = async (id) => {
    try {
      await api.adminEnable(id);
      load();
    } catch (err) {
      alert("Could not enable user");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.adminDelete(id);
      load();
    } catch (err) {
      alert("Could not delete user");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Admin - Users</h2>
      {loading && <div>Loading users...</div>}
      {!loading && users.length === 0 && <div>No users found</div>}

      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u._id || u.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{u.username} ({u.email})</div>
              <div className="text-sm">Status: {u.disabled ? "Disabled" : "Active"}</div>
            </div>

            <div className="flex gap-2">
              {!u.disabled ? (
                <button className="px-2 py-1 rounded bg-yellow-500" onClick={() => disable(u._id || u.id)}>Disable</button>
              ) : (
                <button className="px-2 py-1 rounded bg-green-600 text-white" onClick={() => enable(u._id || u.id)}>Enable</button>
              )}
              <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => remove(u._id || u.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}