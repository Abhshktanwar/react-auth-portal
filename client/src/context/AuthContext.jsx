import { createContext, useContext, useState, useEffect } from "react";

// 1. Context create karte hain
const AuthContext = createContext();

// 2. AuthProvider component jo poorayapp ko dat provide karega

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect Hook: Page refresh hone par check karega ki pehle se login to nahi tha?

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function: Jab user login karega to State + LocalStorage dono me save karenge

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function: Data clear karna

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. custom hook: Taaki kisi bhi component me `useAuth()` likh kar access kar sakein

export function useAuth() {
  return useContext(AuthContext);
}
