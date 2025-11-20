import React, { useState } from "react";
import { api } from "../api/api";

export default function HealthPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    try {
      const res = await api.health();
      setStatus({ ok: true, data: res.data });
    } catch (err) {
      setStatus({ ok: false, error: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 max-w-lg">
      <h2 className="text-2xl font-semibold mb-4">Server Health</h2>

      <button
        onClick={check}
        className="px-3 py-1 rounded bg-blue-600 text-white"
        disabled={loading}
      >
        {loading ? "Checking..." : "Check health"}
      </button>

      {status && (
        <pre className="mt-4 p-3 bg-gray-100 rounded text-sm overflow-auto">
          {JSON.stringify(status, null, 2)}
        </pre>
      )}
    </div>
  );
}