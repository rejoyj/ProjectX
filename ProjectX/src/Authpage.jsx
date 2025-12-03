import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const toggleMode = () => setMode(mode === "login" ? "signup" : "login");

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg p-4" style={{ width: "420px", borderRadius: "18px" }}>
        <h2 className="text-center mb-4 fw-bold text-dark">
          {mode === "login" ? "Welcome Back" : "Create Your Account"}
        </h2>

        <form className="mt-3">
          {mode === "signup" && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="Enter full name" />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter your email" />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter your password" />
          </div>

          {mode === "signup" && (
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" placeholder="Re-enter your password" />
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
          {mode === "login" ? "Don't have an account?" : "Already registered?"}
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
