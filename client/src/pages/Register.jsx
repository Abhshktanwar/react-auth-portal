import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
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
      <h2 style={{ textAlign: "center" }}>📝 Create Account</h2>
      <p style={{ textAlign: "center", color: "#64748b" }}>
        Naya account banayein
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
        <label>Full Name:</label>
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
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <label>Username:</label>
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
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label>Email:</label>
        <input
          style={{
            width: "100%",
            padding: "10px",
            margin: "6px 0 16px",
            borderRadius: 6,
            border: "1px solid #cbd5e1",
            boxSizing: "border-box",
          }}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
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
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating..." : "Register Now"}
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: 15 }}>
        Pehle se account hai?{" "}
        <Link to="/login" style={{ color: "#2563eb", fontWeight: "bold" }}>
          Login karein
        </Link>
      </p>
    </div>
  );
}
