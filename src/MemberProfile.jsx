import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MemberProfile() {
  const { id } = useParams();
  const BASE_URL = "https://projectx-backend-sqvi.onrender.com";

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/auth/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // 🔑 backend sends USER directly, not { user }
        if (data && data._id) {
          setProfile(data);
        } else {
          setProfile(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setProfile(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="text-center mt-5">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-center mt-5 text-danger">Profile not found</p>;
  }

  return (
    <div className="min-vh-100" style={{ padding: "40px 0" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div
              className="card p-3 shadow-lg border-0"
              style={{ borderRadius: "15px" }}
            >
              <h4 className="mb-3">Member Profile</h4>

              <p>
                <strong>Name:</strong> {profile.fullName || "—"}
              </p>

              <p>
                <strong>Email:</strong> {profile.email || "—"}
              </p>

              <p>
                <strong>Profession:</strong> {profile.profession || "—"}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
