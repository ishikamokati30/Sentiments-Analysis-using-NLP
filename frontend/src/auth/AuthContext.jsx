import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { loginRequest, signupRequest } from "./authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => window.localStorage.getItem("sentiment-token") || "",
  );
  const [user, setUser] = useState(() => {
    try {
      const raw = window.localStorage.getItem("sentiment-user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      window.localStorage.setItem("sentiment-token", token);
    } else {
      window.localStorage.removeItem("sentiment-token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem("sentiment-user", JSON.stringify(user));
    } else {
      window.localStorage.removeItem("sentiment-user");
    }
  }, [user]);

  const login = async (payload) => {
    setLoading(true);
    try {
      const response = await loginRequest(payload);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const response = await signupRequest(payload);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
      signup,
      token,
      user,
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
