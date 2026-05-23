import React, { createContext, useContext, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const STORAGE_KEY = "syncmind_google_id_token";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || "";
    if (stored) {
      try {
        const decoded = jwtDecode(stored);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem(STORAGE_KEY);
          return { token: "", user: null };
        }
        return { token: stored, user: decoded };
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        return { token: "", user: null };
      }
    }
    return { token: "", user: null };
  });

  const { token, user } = auth;

  const updateToken = (newToken) => {
    if (newToken) {
      try {
        const decoded = jwtDecode(newToken);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem(STORAGE_KEY);
          setAuth({ token: "", user: null });
        } else {
          localStorage.setItem(STORAGE_KEY, newToken);
          setAuth({ token: newToken, user: decoded });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setAuth({ token: "", user: null });
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setAuth({ token: "", user: null });
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(user),
      setToken: updateToken,
      logout: () => updateToken(""),
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}