"use client";

import React, { useEffect } from "react";
// components
import { Footer, Navbar } from "@/components";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.userID) {
      // Redirect to the user profile page with the user's ID
      router.push(`/user/${user.userID}`);
    } else if (user === null) {
      // User is not logged in, redirect to login
      router.push('/login');
    }
  }, [user, router]);

  // Show loading while redirecting
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to your profile...</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
