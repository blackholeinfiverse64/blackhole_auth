import { createContext, useContext, useEffect, useMemo, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMe = async () => {
    const { data } = await client.get("/api/auth/me");
    setUser(data.user);
    return data.user;
  };

  const login = async (payload) => {
    setIsLoading(true);
    try {
      const { data } = await client.post("/api/auth/login", payload);
      setUser(data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload) => {
    setIsLoading(true);
    try {
      const { data } = await client.post("/api/auth/register", payload);
      setUser(data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await client.post("/api/auth/logout");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await client.get("/api/auth/me");
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

  const value = useMemo(
    () => ({ user, isBootstrapping, isLoading, fetchMe, login, signup, logout }),
    [user, isBootstrapping, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
