import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const toggleMode = () =>
    setMode(mode === "login" ? "signup" : "login");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ---------------------------------------------------
  // SUBMIT HANDLER
  // ---------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "signup" && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const url =
      mode === "signup"
        ? "http://localhost:5000/auth/signup"
        : "http://localhost:5000/auth/login";

    const payload =
      mode === "signup"
        ? { fullName, email, password }
        : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", data);

      // Backend always returns { success, message, user }
      if (!data.success) {
        alert(data.message || "Something went wrong");
        return;
      }

      // Save full user object (includes _id)
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect
      window.location.href = "/dashboard";

    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div
        className="card shadow-lg p-4"
        style={{ width: "420px", borderRadius: "18px" }}
      >
        <h2 className="text-center mb-4 fw-bold text-dark">
          {mode === "login" ? "Welcome Back" : "Create Your Account"}
        </h2>

        <form className="mt-3" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === "signup" && (
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold mt-2"
            style={{ borderRadius: "10px" }}
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4">
          {mode === "login"
            ? "Don't have an account?"
            : "Already registered?"}
          <button
            className="btn btn-link p-0 ms-1"
            style={{ fontWeight: "600" }}
            onClick={toggleMode}
          >
            {mode === "login" ? "Create one" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
