import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, loginAdmin, loginUser, registerUser } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveSession = (data) => {
    localStorage.setItem("techdea_token", data.token);
    localStorage.setItem("techdea_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  useEffect(() => {
    const boot = async () => {
      const token = localStorage.getItem("techdea_token");
      const cached = localStorage.getItem("techdea_user");

      if (!token) {
        setLoading(false);
        return;
      }

      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          localStorage.removeItem("techdea_user");
        }
      }

      try {
        const { data } = await getMe();
        setUser(data.user);
        localStorage.setItem("techdea_user", JSON.stringify(data.user));
      } catch {
        localStorage.removeItem("techdea_token");
        localStorage.removeItem("techdea_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, []);

  const login = async (payload) => {
    const { data } = await loginUser(payload);
    saveSession(data);
    return data;
  };

  const adminLogin = async (payload) => {
    const { data } = await loginAdmin(payload);
    saveSession(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await registerUser(payload);
    saveSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("techdea_token");
    localStorage.removeItem("techdea_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, adminLogin, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);