import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  // ---------------------------------------------------
  // Backend BASE URL (Render)
  // ---------------------------------------------------
  const BASE_URL = "https://projectx-backend-sqvi.onrender.com";

  const navigate = useNavigate();

  // ---------------------------------------------------
  // Load user from localStorage
  // ---------------------------------------------------
  let raw = localStorage.getItem("user");
  if (raw === "undefined" || raw === "null") raw = null;
  const user = raw ? JSON.parse(raw) : null;

  // ---------------------------------------------------
  // Profile state (initialize from stored user)
  // ---------------------------------------------------
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profession: user?.profession || "",
    website: user?.website || "",
  });

  const [editing, setEditing] = useState(false);

  // ---------------------------------------------------
  // Activity rows
  // ---------------------------------------------------
  const [rows, setRows] = useState([]);

  // ---------------------------------------------------
  // Fetch activity from backend
  // ---------------------------------------------------
  useEffect(() => {
    if (!user?._id) return;

    fetch(`${BASE_URL}/activity/${user._id}`)
      .then((res) => res.json())
      .then((data) => setRows(data || []))
      .catch(() => setRows([]));
  }, [user]);

  // ---------------------------------------------------
  // Profile change handler
  // ---------------------------------------------------
  function handleProfileChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  // ---------------------------------------------------
  // Save profile to backend
  // ---------------------------------------------------
  function saveProfile() {
    fetch(`${BASE_URL}/auth/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then((res) => res.json())
      .then((data) => {
        const updated = data.user || profile;

        // Save updated user locally
        localStorage.setItem("user", JSON.stringify(updated));

        setProfile(updated);
        setEditing(false);
      })
      .catch((err) => console.error("Update failed", err));
  }

  // ---------------------------------------------------
  // Render UI
  // ---------------------------------------------------
  return (
    <div className="min-vh-100" style={{ padding: "40px 0" }}>
      <div className="container">
        <h2 className="mb-4 fw-bold">Dashboard</h2>

        {/* WELCOME BOX */}
        <div className="mb-4">
          {user ? (
            <p className="fs-5">Welcome, {user.fullName || user.email}</p>
          ) : (
            <p className="fs-5">No user logged in</p>
          )}
        </div>

        <div className="row">
          {/* ---------------------------------------------------
              PROFILE SECTION
          --------------------------------------------------- */}
          <div className="col-md-4">
            <div
              className="card p-3 shadow-lg border-0"
              style={{ borderRadius: "15px" }}
            >
              <h4 className="mb-3">Your Profile</h4>

              {!editing ? (
                <>
                  <p>
                    <strong>Name:</strong> {profile.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile.email}
                  </p>
                  <p>
                    <strong>Profession:</strong>{" "}
                    {profile.profession || "—"}
                  </p>
                  <p>
                    <strong>Bio:</strong> {profile.bio || "—"}
                  </p>
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
                    ) : (
                      "—"
                    )}
                  </p>

                  {/* EDIT PROFILE */}
                  <button
                    className="btn btn-primary mt-2 w-100"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>

                  {/* VIEW AS MEMBER */}
                  <button
                    className="btn btn-info mt-2 w-100 text-white"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    View as Member
                  </button>

                  {/* SHAREABLE URL */}
                  <div className="mt-3">
                    <small className="text-muted">Sharable URL:</small>
                    <div className="text-primary" style={{ cursor: "pointer" }}>
                      profile/{user?._id}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control mb-2"
                    placeholder="Full Name"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                  />

                  <input
                    type="text"
                    name="profession"
                    className="form-control mb-2"
                    placeholder="Profession"
                    value={profile.profession}
                    onChange={handleProfileChange}
                  />

                  <textarea
                    name="bio"
                    className="form-control mb-2"
                    placeholder="Short Bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                  />

                  <input
                    type="text"
                    name="website"
                    className="form-control mb-2"
                    placeholder="Website"
                    value={profile.website}
                    onChange={handleProfileChange}
                  />

                  <button
                    className="btn btn-success mt-2 w-100"
                    onClick={saveProfile}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ---------------------------------------------------
              ACTIVITY TABLE
          --------------------------------------------------- */}
          <div className="col-md-8">
            <div
              className="card p-3 shadow-lg border-0"
              style={{ borderRadius: "15px" }}
            >
              <h4 className="mb-3">Activity Table</h4>

              <table className="table table-hover table-bordered">
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
                      <td colSpan="4" className="text-center text-muted py-3">
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
    </div>
  );
}
