"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { AuthProvider } from "@/components/context/AuthContext";
import JwtExpirationHandler from "@/components/auth/jwt-expiration-handler";

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JwtExpirationHandler />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default Layout;
