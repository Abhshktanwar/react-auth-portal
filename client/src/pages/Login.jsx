import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      login(data.user, data.token);
      navigate("/portal");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 30,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center" }}>🔐 Welcome Back</h2>
      <p style={{ textAlign: "center", color: "#64748b" }}>
        Apna account login karein
      </p>
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: 10,
            borderRadius: 6,
            marginBottom: 15,
          }}
        >
          ⚠️ {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>Email ya Username:</label>
        <input
          style={{
            width: "100%",
            padding: "10px",
            margin: "6px 0 16px",
            borderRadius: 6,
            border: "1px solid #cbd5e1",
            boxSizing: "border-box",
          }}
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          style={{
            width: "100%",
            padding: "10px",
            margin: "6px 0 16px",
            borderRadius: 6,
            border: "1px solid #cbd5e1",
            boxSizing: "border-box",
          }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Verifying..." : "Login to Portal"}
        </button>
      </form>
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button
          type="button"
          onClick={() => {
            setEmailOrUsername("rahul@test.com");
            setPassword("password123");
          }}
          style={{
            padding: "6px 12px",
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          ⚡ Auto-fill Demo User
        </button>
      </div>
      <p style={{ textAlign: "center", marginTop: 15 }}>
        Naye ho?{" "}
        <Link to="/register" style={{ color: "#2563eb", fontWeight: "bold" }}>
          Register karein
        </Link>
      </p>
    </div>
  );
}
