"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/components/types/auth";
import { safeDecodeJWT, extractUserFromJWT } from "@/utils/jwtUtils";

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
      
      // Decode JWT token to get user info
      try {
        console.log("Attempting to decode stored token...");
        const decoded = safeDecodeJWT(storedToken);
        
        if (decoded && decoded.payload) {
          const userInfo = extractUserFromJWT(decoded.payload);
          setUser({
            id: parseInt(storedUserId),
            ...userInfo,
            role: storedRole
          });
        } else {
          throw new Error("Failed to decode JWT token");
        }
      } catch (error) {
        console.error("Error decoding stored token:", error);
        // Clear invalid token data
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        setUser(null);
        setToken(null);
      }
    }
  }, []);

  const login = (newToken: string, userId: string, role: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userRole", role);
    
    setToken(newToken);
    
    // Decode JWT token to get user info
    try {
      console.log("Attempting to decode login token...");
      const decoded = safeDecodeJWT(newToken);
      
      if (decoded?.payload) {
        const userInfo = extractUserFromJWT(decoded.payload);
        setUser({
          id: parseInt(userId),
          ...userInfo,
          role
        });
      } else {
        throw new Error("Failed to decode JWT token");
      }
    } catch (error) {
      console.error("Error decoding login token:", error);
      setUser({
        id: parseInt(userId),
        username: "",
        email: "",
        fullName: "",
        avatar: "",
        role
      });
    }
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
