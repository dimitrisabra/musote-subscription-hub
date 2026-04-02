import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "user" | "admin" | null;

interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  plan: "free" | "pro";
  joinedDate: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  quickLogin: (role: "user" | "admin") => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_DB: Record<string, { password: string; user: AuthUser }> = {
  "user@example.com": {
    password: "123",
    user: { email: "user@example.com", name: "Alex Johnson", role: "user", avatar: "AJ", plan: "pro", joinedDate: "2024-01-15" },
  },
  "admin@example.com": {
    password: "123",
    user: { email: "admin@example.com", name: "Sarah Admin", role: "admin", avatar: "SA", plan: "pro", joinedDate: "2023-06-01" },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string): boolean => {
    const entry = USERS_DB[email];
    if (entry && entry.password === password) {
      setUser(entry.user);
      return true;
    }
    return false;
  };

  const quickLogin = (role: "user" | "admin") => {
    const email = role === "admin" ? "admin@example.com" : "user@example.com";
    const entry = USERS_DB[email];
    if (entry) setUser(entry.user);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      login,
      logout,
      quickLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
