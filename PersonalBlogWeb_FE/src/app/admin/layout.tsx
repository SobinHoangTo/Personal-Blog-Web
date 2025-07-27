"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";
import Link from "next/link";
import { Navbar } from "@/components";
import { useAuth } from "@/components/context/AuthContext";

export default function AdminAccountsLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user || (user.role !== "0" && user.role !== "2")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Typography variant="h4" color="red" className="text-center">
          Access Denied. You do not have permission to view this page.
        </Typography>
      </div>
    );
  }

  return (
    
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white shadow-md p-6 flex flex-col gap-6">
          <Typography variant="h4" color="blue-gray" className="mb-4">
            {user.role === "0" ? "Admin" : "Staff"} Panel
          </Typography>
          <nav className="flex flex-col gap-4">
            <Link href="/admin/categories" className="text-blue-600 font-medium hover:underline">
              Manage Categories
            </Link>
            <Link href="/admin/posts" className="text-blue-600 font-medium hover:underline">
              Manage Posts
            </Link>
            {user.role === "0" && (
              <Link href="/admin/accounts" className="text-blue-600 font-medium hover:underline">
                Manage Accounts
              </Link>
            )}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </>
  );
} 