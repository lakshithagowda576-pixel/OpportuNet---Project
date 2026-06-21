import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin" | "hr";
  avatar?: string | null;
  phone?: string | null;
  address?: string | null;
  resumeUrl?: string | null;
  education?: string | null;
  qualification?: string | null;
  bio?: string | null;
  skills?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
  loginWithGoogle: () => void;
  loginWithGitHub: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async () => {
    console.log("fetchMe started");
    try {
      const url = `${API_BASE}/api/auth/me`;
      console.log("fetching:", url);
      const res = await fetch(url, { credentials: "include" });
      console.log("fetchMe response status:", res.status);
      if (res.ok) {
        const data = await res.json();
        setUser(data);

        // Store Google/OAuth account info for quick selection next time
        if (data.email && data.name) {
          try {
            const saved = localStorage.getItem("google_accounts");
            let accounts = saved ? JSON.parse(saved) : [];
            
            // Add or update this account
            const existingIndex = accounts.findIndex((a: any) => a.email === data.email);
            if (existingIndex >= 0) {
              accounts[existingIndex].lastUsed = new Date().toISOString();
              accounts = [accounts[existingIndex], ...accounts.slice(0, existingIndex), ...accounts.slice(existingIndex + 1)];
            } else {
              accounts.unshift({
                email: data.email,
                name: data.name,
                lastUsed: new Date().toISOString(),
              });
            }
            
            // Keep only last 5 accounts
            accounts = accounts.slice(0, 5);
            localStorage.setItem("google_accounts", JSON.stringify(accounts));
          } catch {
            // Ignore storage errors
          }
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMe(); }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    setUser(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    setUser(data);
  };

  const logout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
  };

  const loginWithGoogle = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  const loginWithGitHub = () => {
    window.location.href = `${API_BASE}/api/auth/github`;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refetch: fetchMe, loginWithGoogle, loginWithGitHub }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
