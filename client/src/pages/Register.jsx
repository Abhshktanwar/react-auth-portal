import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  // 1. useState Hooks: Form data aur messages track karne ke liye
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Form Submit: Yahan se data Backend API aur Database me jata hai!
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Backend ko API call
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Backend se token aur user details aate hi AuthContext me save
      login(data.user, data.token);

      // User ko seedha Portal pe bhej do!
      navigate("/portal");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
    backgroundColor: "#2563eb",
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
        📝 Create Account
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "#64748b",
          fontSize: "14px",
          marginBottom: "24px",
        }}
      >
        Database me naya user store karne ke liye form bharein
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
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          placeholder="e.g. Abhishek Kumar"
          value={formData.fullName}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Username:</label>
        <input
          type="text"
          name="username"
          placeholder="e.g. abhi123"
          value={formData.username}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Email Address:</label>
        <input
          type="email"
          name="email"
          placeholder="abhi@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Creating User in Database..." : "Register Now"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px" }}>
        Pehle se account hai?{" "}
        <Link to="/login" style={{ color: "#2563eb", fontWeight: "bold" }}>
          Login karein
        </Link>
      </p>
    </div>
  );
}
