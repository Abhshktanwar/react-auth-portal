import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portal from "./pages/Portal";

export default function App() {
  return (
    // AuthProvider se wrap kiya taaki pooray app me user state mil sake
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar har page upar dikhega*/}
        <Navbar />
        {/* URL ke hisaab se page badlega */}
        <main style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* ✅ Portal ab Protected hai! Bina login ke koi access nahi kar sakta */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <Portal />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
