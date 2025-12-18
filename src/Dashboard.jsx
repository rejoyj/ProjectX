import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const BASE_URL = "https://projectx-backend-sqvi.onrender.com";
  const navigate = useNavigate();

  // ---------------- USER ----------------
  let raw = localStorage.getItem("user");
  if (raw === "undefined" || raw === "null") raw = null;
  const user = raw ? JSON.parse(raw) : null;

  // ---------------- PROFILE ----------------
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profession: user?.profession || "",
    website: user?.website || "",
  });

  const [editing, setEditing] = useState(false);

  // ---------------- ACTIVITY ----------------
  const [rows, setRows] = useState([]);

  // ---------------- WIFI MODAL ----------------
  const [showWifi, setShowWifi] = useState(false);

  useEffect(() => {
    if (!user?._id) return;

    fetch(`${BASE_URL}/activity/${user._id}`)
      .then((res) => res.json())
      .then((data) => setRows(data || []))
      .catch(() => setRows([]));
  }, [user]);

  function handleProfileChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  function saveProfile() {
    fetch(`${BASE_URL}/auth/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then((res) => res.json())
      .then((data) => {
        const updated = data.user || profile;
        localStorage.setItem("user", JSON.stringify(updated));
        setProfile(updated);
        setEditing(false);
      })
      .catch(() => alert("Profile update failed"));
  }

  return (
    <div className="min-vh-100" style={{ padding: "40px 0" }}>
      <div className="container">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Dashboard</h2>
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowWifi(true)}
          >
            🔌 Connect with Reader
          </button>
        </div>

        {/* WELCOME */}
        <p className="fs-5 mb-4">
          Welcome, {user?.fullName || user?.email}
        </p>

        <div className="row">
          {/* PROFILE */}
          <div className="col-md-4">
            <div className="card p-3 shadow-lg border-0">
              <h4>Your Profile</h4>

              {!editing ? (
                <>
                  <p><strong>Name:</strong> {profile.fullName}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Profession:</strong> {profile.profession || "—"}</p>
                  <p><strong>Bio:</strong> {profile.bio || "—"}</p>
                  <p>
                    <strong>Website:</strong>{" "}
                    {profile.website ? (
                      <a
                        href={
                          profile.website.startsWith("http")
                            ? profile.website
                            : `https://${profile.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {profile.website}
                      </a>
                    ) : "—"}
                  </p>

                  <button
                    className="btn btn-primary w-100 mt-2"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>

                  <button
                    className="btn btn-info w-100 mt-2 text-white"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    View as Member
                  </button>
                </>
              ) : (
                <>
                  <input
                    className="form-control mb-2"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                  />
                  <input
                    className="form-control mb-2"
                    name="profession"
                    value={profile.profession}
                    onChange={handleProfileChange}
                  />
                  <textarea
                    className="form-control mb-2"
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                  />
                  <input
                    className="form-control mb-2"
                    name="website"
                    value={profile.website}
                    onChange={handleProfileChange}
                  />
                  <button
                    className="btn btn-success w-100"
                    onClick={saveProfile}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="col-md-8">
            <div className="card p-3 shadow-lg border-0">
              <h4>Activity Table</h4>

              <table className="table table-bordered mt-3">
                <thead className="table-dark">
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Link</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr key={i}>
                        <td>{r.date}</td>
                        <td>{r.time}</td>
                        <td>
                          <a href={r.link} target="_blank" rel="noreferrer">
                            {r.link}
                          </a>
                        </td>
                        <td>{r.note}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* WIFI MODAL */}
      {showWifi && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Connect with Reader</h5>
                <button className="btn-close" onClick={() => setShowWifi(false)} />
              </div>
              <div className="modal-body">
                <WifiScanner />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- WIFI SCANNER ---------------- */

function WifiScanner() {
  const [scanning, setScanning] = useState(false);
  const [networks, setNetworks] = useState([]);
  const [status, setStatus] = useState("");

  const fakeNetworks = [
    "Reader_Device_01",
    "Reader_Device_02",
    "Office_WiFi",
    "Home_Network",
  ];

  function scan() {
    setScanning(true);
    setNetworks([]);
    setStatus("");

    setTimeout(() => {
      setNetworks(fakeNetworks);
      setScanning(false);
    }, 2000);
  }

  function connect(name) {
    setStatus("Connecting to " + name + "...");
    setTimeout(() => {
      setStatus("✅ Connected to " + name);
    }, 1500);
  }

  return (
    <>
      <button className="btn btn-primary w-100 mb-3" onClick={scan}>
        Tap to Search
      </button>

      {scanning && <p className="text-primary">Searching for networks...</p>}

      {networks.map((n) => (
        <div
          key={n}
          className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
        >
          <span>{n}</span>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => connect(n)}
          >
            Connect
          </button>
        </div>
      ))}

      {status && <p className="mt-3">{status}</p>}
    </>
  );
}
