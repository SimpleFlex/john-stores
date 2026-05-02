import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("adminData");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // ── Verify token on mount ────────────────────────────────────────
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setAdmin(res.data.admin);
        localStorage.setItem("adminData", JSON.stringify(res.data.admin));
      } catch {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  // ── Login ────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, admin } = res.data;
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminData", JSON.stringify(admin));
    setAdmin(admin);
    return admin;
  };

  // ── Logout ───────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
