export default function Dashboard() {
  let raw = localStorage.getItem("user");

  // Prevent crash if raw is "undefined" or "null"
  if (raw === "undefined" || raw === "null") {
    raw = null;
  }

  const user = raw ? JSON.parse(raw) : null;

  return (
    <div style={{ padding: "40px", fontSize: "24px" }}>
      <h1>Dashboard</h1>

      {user ? (
        <p>Welcome, {user.fullName || user.email}</p>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
}
