import React, { createContext, useContext, useMemo, useState } from "react";
import type { LoginResponse, Role } from "../types/api";

interface AuthState {
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  const value = useMemo<AuthState>(
    () => ({
      token,
      role,
      isAuthenticated: Boolean(token),
      login: (data) => {
        setToken(data.access_token);
        setRole(data.role);
      },
      logout: () => {
        setToken(null);
        setRole(null);
      }
    }),
    [token, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}