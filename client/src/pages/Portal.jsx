import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Portal() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect Hook: Page khulte hi database se fresh data fetch karta hai
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Token pass kiya taaki backend pehchaan sake
          },
        });

        const data = await response.json();
        if (data.success) {
          setProfile(data.user);
        }
      } catch (err) {
        console.error("Error fetching profile from DB:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const activeUser = profile || user;

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
  };

  const badgeStyle = {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
  };

  return (
    <div>
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: "#0f172a",
          color: "white",
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "24px",
        }}
      >
        <span style={badgeStyle}>🟢 Live SQLite Database Connected</span>
        <h1 style={{ margin: "12px 0 6px" }}>
          Welcome to your Portal, {activeUser?.fullName}! 👋
        </h1>
        <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>
          Aapka authentication successful raha. Yeh data seedha backend database
          se fetch hua hai.
        </p>
      </div>

      {/* Profile Details Card */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "16px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>👤 User Profile Information</h2>
          <button
            onClick={logout}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>

        {loading ? (
          <p>Database se data load ho raha hai...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "bold",
                }}
              >
                FULL NAME
              </span>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                {activeUser?.fullname}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "bold",
                }}
              >
                USERNAME
              </span>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#2563eb",
                }}
              >
                @{activeUser?.username}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "bold",
                }}
              >
                EMAIL ADDRESS
              </span>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                {activeUser?.email}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "bold",
                }}
              >
                DESIGNATION / ROLE
              </span>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#059669",
                }}
              >
                {activeUser?.role || "Frontend Developer"}
              </p>
            </div>
          </div>
        )}

        {/* Database Proof Explainer */}
        <div
          style={{
            marginTop: "28px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ margin: "0 0 8px", color: "#166534" }}>
            💡 Under The Hood: Ye kaise kaam kiya?
          </h4>
          <ol
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "#15803d",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>Aapne Login form submit kiya (`useState`).</li>
            <li>
              React ne <b>POST /api/login</b> bhej kar database me match kiya
              (`fetch`).
            </li>
            <li>Backend ne match karke JWT Token return kiya.</li>
            <li>
              <b>AuthContext</b> ne us token ko <b>localStorage</b> me save
              kiya.
            </li>
            <li>
              React Router ke <b>ProtectedRoute</b> ne Portal ka darwaza khola.
            </li>
            <li>
              Is page ke <b>useEffect</b> ne token ke sath{" "}
              <b>GET /api/profile</b> call karke aapki details render kar di!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
