import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
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

  // ---------------- RFID ACTIVITY ----------------
  const [rows, setRows] = useState([]);

  // ---------------- WIFI MODAL ----------------
  const [showWifi, setShowWifi] = useState(false);

  /* ------------------------------------
     FETCH RFID DATA
  ------------------------------------ */
  useEffect(() => {
    fetch("https://esp-a6df.onrender.com/api/data")
      .then((res) => res.json())
      .then((data) => setRows(data || []))
      .catch(() => setRows([]));
  }, []);

  /* ------------------------------------
     PROFILE HANDLERS
  ------------------------------------ */
  function handleProfileChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  function saveProfile() {
    fetch(`https://projectx-backend-sqvi.onrender.com/auth/${user._id}`, {
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

  /* ------------------------------------
     UPDATE NOTE (AUTO SAVE)
  ------------------------------------ */
  function updateNote(index, value) {
    const updated = [...rows];
    updated[index].note = value;
    setRows(updated);

    clearTimeout(updated[index].timer);
    updated[index].timer = setTimeout(() => {
      fetch(`https://esp-a6df.onrender.com/api/data/${updated[index].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: value }),
      });
    }, 500);
  }

  return (
    <div className="d-flex min-vh-100">
      {/* ---------------- LEFT NAVBAR ---------------- */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "230px", position: "fixed", height: "100vh" }}
      >
        <h4 className="text-center mb-4">ProjectX</h4>

        <ul className="nav nav-pills flex-column gap-2">
          <li className="nav-item">
            <button className="nav-link text-white" onClick={() => navigate("/")}>
              🏠 Home
            </button>
          </li>

          <li className="nav-item">
            <button className="nav-link active">📊 Dashboard</button>
          </li>

          <li className="nav-item">
            <button
              className="nav-link text-white"
              onClick={() => navigate(`/profile/${user?._id}`)}
            >
              👤 Profile
            </button>
          </li>

          <li className="nav-item">
            <button
              className="nav-link text-white"
              onClick={() => navigate("/settings")}
            >
              ⚙️ Settings
            </button>
          </li>
        </ul>
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="flex-grow-1" style={{ marginLeft: "230px", padding: "40px 0" }}>
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

                    <button
                      className="btn btn-primary w-100 mt-2"
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
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
                    <button className="btn btn-success w-100" onClick={saveProfile}>
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ACTIVITY TABLE */}
            <div className="col-md-8">
              <div className="card p-3 shadow-lg border-0">
                <h4>RFID Activity</h4>

                <table className="table table-bordered mt-3">
                  <thead className="table-dark">
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>URL</th>
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
                        <tr key={r.id}>
                          <td>{r.date}</td>
                          <td>{r.time}</td>
                          <td className="fw-bold">{r.url}</td>
                          <td>
                            <input
                              className="form-control form-control-sm"
                              value={r.note}
                              placeholder="Add note..."
                              onChange={(e) => updateNote(i, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
