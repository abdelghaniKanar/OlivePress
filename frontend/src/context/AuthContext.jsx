import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Route guards
export function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <div className="p-6">Please log in.</div>;
  return children;
}

export function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user) return <div className="p-6">Please log in.</div>;
  if (role && user.role !== role) return <div className="p-6">Forbidden.</div>;
  return children;
}
