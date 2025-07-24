"use client";

import React from "react";
import { Footer, Navbar } from "@/components";
import {
  UserProfileHeader,
  UserPostsSection,
  UserProfileLoading,
  UserProfileError
} from "@/components/user-profile";
import { useUserProfile } from "@/hooks/useUserProfile";
import CreatePostForm from "@/components/user-profile/create-post-form";

interface UserProfilePageProps {
  readonly params: Promise<{ userId: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const resolvedParams = React.use(params);
  const userId = parseInt(resolvedParams.userId);
  const { user, posts, loading, error } = useUserProfile(userId);

  if (loading) {
    return (
      <>
        <Navbar />
        <UserProfileLoading />
        <Footer />
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Navbar />
        <UserProfileError error={error || "User not found"} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <UserProfileHeader user={user} userId={userId} postsCount={posts.length} />
        {user.id === userId && (
          <CreatePostForm userId={userId} onPostCreated={() => window.location.reload()} />
        )}
        <UserPostsSection user={user} posts={posts} />
      </div>
      <Footer />
    </>
  );
}
