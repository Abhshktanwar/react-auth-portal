import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  // 1. useState: Inputs, errors aur loading sambhalne ke liye
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  //2. Submit handler: Backend API ko request bhejta hai
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      // Backend se Token + User details mil gayi -> Context me save kiya
      login(data.user, data.token);
      // User ke Portal page par redirect!
      navigate("/portal");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Demo user autofill karne ke liye shortcut
  const handleQuickDemo = () => {
    setEmailOrUsername("rahul@test.com");
    setPassword("password123");
  };
  const cardStyle = {
    maxWidth: "420px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    margin: "8px 0 16px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
    fontSize: "14px",
  };
  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#10b981",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  };
  return (
    <div style={cardStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "8px" }}>
        🔐 Welcome Back
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "#64748b",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        Apna account login karke Portal me enter karein
      </p>
      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          ⚠️ {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>Email ya Username:</label>
        <input
          type="text"
          placeholder="e.g. rahul@test.com ya rahul123"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
          style={inputStyle}
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Verifying with Database..." : "Login to Portal"}
        </button>
      </form>
      {/* Quick Testing Button */}
      <div
        style={{
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "1px solid #e2e8f0",
          textAlign: "center",
        }}
      >
        <button
          type="button"
          onClick={handleQuickDemo}
          style={{
            backgroundColor: "#f1f5f9",
            color: "#475569",
            border: "1px solid #cbd5e1",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ⚡ Auto-fill Demo User (rahul@test.com)
        </button>
      </div>
      <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px" }}>
        Naye ho?{" "}
        <Link to="/register" style={{ color: "#2563eb", fontWeight: "bold" }}>
          Register karein
        </Link>
      </p>
    </div>
  );
}
