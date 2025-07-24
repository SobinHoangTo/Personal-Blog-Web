"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";
import Link from "next/link";
import { Navbar } from "@/components";

export default function AdminAccountsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white shadow-md p-6 flex flex-col gap-6">
          <Typography variant="h4" color="blue-gray" className="mb-4">
            Admin Panel
          </Typography>
          <nav className="flex flex-col gap-4">
            <Link href="/admin/categories" className="text-blue-600 font-medium hover:underline">
              Manage Categories
            </Link>
            <Link href="/admin/posts" className="text-blue-600 font-medium hover:underline">
              Manage Posts
            </Link>
            <Link href="/admin/accounts" className="text-blue-600 font-medium hover:underline">
              Manage Accounts
            </Link>
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