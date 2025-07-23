"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/components/types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userId: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored authentication data on app load
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");

    if (storedToken && storedUserId && storedRole) {
      setToken(storedToken);
      setUser({
        id: parseInt(storedUserId),
        username: "", // Will be fetched from API if needed
        email: "",
        fullName: "",
        role: storedRole
      });
    }
  }, []);

  const login = (newToken: string, userId: string, role: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userRole", role);
    
    setToken(newToken);
    setUser({
      id: parseInt(userId),
      username: "",
      email: "",
      fullName: "",
      role
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
