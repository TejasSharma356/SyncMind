import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../Auth/AuthContext";

export default function Login({ onBack, onSuccess }) {
  const { setToken, isAuthenticated } = useAuth();
  const [error, setError] = useState("");

  const handleSuccess = (credentialResponse) => {
    setError("");
    const token = credentialResponse.credential;
    if (token) {
      setToken(token); // stored in localStorage by AuthContext
      onSuccess?.();
    } else {
      setError("No token received from Google");
    }
  };

  const handleError = () => {
    setError("Google sign-in failed");
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: 420, padding: 32, borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}>
        <h2 style={{ marginTop: 0, marginBottom: 24, textAlign: "center" }}>Sign in</h2>

        {isAuthenticated ? (
          <p style={{ textAlign: "center" }}>You’re already signed in.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="filled_black"
                shape="pill"
                text="continue_with"
                size="large"
              />
            </div>

            <div style={{ margin: "8px 0", textAlign: "center", opacity: 0.7, width: "100%" }}>OR</div>

            <input
              placeholder="Enter your email"
              disabled
              style={{ width: "100%", padding: 12, borderRadius: 12, marginBottom: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "inherit" }}
            />
            <button disabled style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "inherit", opacity: 0.5 }}>
              Continue with email
            </button>

            {error ? <div style={{ marginTop: 12, color: "tomato", textAlign: "center" }}>{error}</div> : null}
          </div>
        )}

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
          <button onClick={onBack} style={{ padding: "10px 24px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "inherit", cursor: "pointer", fontWeight: 600 }}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}