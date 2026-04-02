import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import client from "../api/client";

const AUTH_SERVER = import.meta.env.VITE_AUTH_SERVER_URL || "https://bhiv-auth.onrender.com";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await client.get("/api/me");
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    const redirect = encodeURIComponent(window.location.origin);
    window.location.href = `${AUTH_SERVER}/logout?redirect=${redirect}`;
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await client.get("/api/me");
        if (mounted) setUser(data.user);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsBootstrapping(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== AUTH_SERVER) return;
      if (e.data?.type === "blackhole-auth-success") {
        fetchMe();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [fetchMe]);

  const value = useMemo(
    () => ({ user, isBootstrapping, fetchMe, logout, authServerUrl: AUTH_SERVER }),
    [user, isBootstrapping, fetchMe, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
