"use client";

import { useAuth } from "@/components/context/AuthContext";
import { getUserPosts } from "@/lib/api";
import { useEffect, useState } from "react";
import UserProfileHeader from "@/components/user-profile/user-profile-header";

function ProfileHero() {
  const { user } = useAuth();
  const [postsCount, setPostsCount] = useState(0);

  useEffect(() => {
    const fetchPostsCount = async () => {
      if (user) {
        try {
          const posts = await getUserPosts(user.userID);
          setPostsCount(posts.length);
        } catch (error) {
          console.error("Error fetching posts count:", error);
        }
      }
    };

    fetchPostsCount();
  }, [user]);

  if (!user) {
    return (
      <header className="mt-5 bg-white p-8">
        <div className="w-full container mx-auto pt-12 pb-24 text-center">
          <p>Please login to view your profile</p>
        </div>
      </header>
    );
  }

  return (
    <UserProfileHeader 
      user={user} 
      userId={user.userID} 
      postsCount={postsCount} 
    />
  );
}

export default ProfileHero;
