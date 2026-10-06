import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // <-- useAuth hook call kiya

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Logout hone ke baad login ppage par bhej do
  };

  const navStyle = {
    dsiplay: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    backgroundColor: "#2f71dd",
    color: " #ffffff",
  };

  const linkStyle = {
    color: "#caebd1",
    textDecoration: "none",
    marginLeft: "18px",
    fontWeight: "bold",
  };

  const btnStyle = {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    marginLeft: "18px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <nav style={navStyle}>
      <h3 style={{ margin: 0 }}>⚛️ Auth Portal</h3>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>

        {user ? (
          // Agar User Login hai:
          <>
            <Link to="/portal" style={linkStyle}>
              User Portal
            </Link>
            <span style={{ marginLeft: "20px", color: "#a7f3d0" }}>
              👤 Hi, {user.fullName || user.username}
            </span>
            <button onClick={handleLogout} style={btnStyle}>
              Logout
            </button>
          </>
        ) : (
          // Agar User Login nahi hai:
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/register" style={linkStyle}>
              Registers
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
