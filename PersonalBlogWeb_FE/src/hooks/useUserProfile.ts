"use client";

import { useState, useEffect } from "react";
import { getUserById, getUserPosts } from "@/lib/api";
import { Post } from "@/components/types/post";
import { User } from "@/components/types/auth";

interface UseUserProfileReturn {
  user: User | null;
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export function useUserProfile(userId: number): UseUserProfileReturn {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user details and posts in parallel
        const [userData, userPosts] = await Promise.all([
          getUserById(userId),
          getUserPosts(userId),
        ]);

        if (!userData) {
          setError("User not found");
          return;
        }

        setUser(userData);
        setPosts(userPosts || []);
      } catch (err) {
        setError("Failed to load user profile");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return { user, posts, loading, error };
}
