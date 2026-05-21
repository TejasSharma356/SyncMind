import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const STORAGE_KEY = "syncmind_google_id_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token]);

  const user = useMemo(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Verify token is not expired (exp is in seconds)
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          return null;
        }
        return decoded;
      } catch {
        return null;
      }
    }
    return null;
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(user),
      setToken,
      logout: () => setToken(""),
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