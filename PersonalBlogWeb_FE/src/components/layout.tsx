"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { AuthProvider } from "@/components/context/AuthContext";

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default Layout;
