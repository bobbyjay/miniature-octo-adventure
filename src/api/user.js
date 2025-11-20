export async function getUserData(token) {
  const headers = { Authorization: `Bearer ${token}` };

  const endpoints = {
    profilePicture: "/api/users/profile-pictures",
    bets: "/api/bets",
    events: "/api/events",
    transactions: "/api/account/transactions",
    notifications: "/api/notifications"
  };

  const results = {};

  for (const key in endpoints) {
    const res = await fetch(endpoints[key], { headers });
    results[key] = await res.json();
  }

  return results;
}