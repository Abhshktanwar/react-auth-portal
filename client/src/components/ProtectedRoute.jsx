import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Agar abhi localStorage check ho raha hai, to loading dikhao
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Loading session...
      </div>
    );
  }

  // Agar user login nahi hai, to use `/login` page par bhej do!
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar user login hai, to portal open hone do!
  return children;
}
