"use client";

import { Typography, Button } from "@material-tailwind/react";
import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import UserPostsManager from "@/components/user-profile/user-posts-manager";
import CreatePostForm from "@/components/user-profile/create-post-form";

function UserPosts() {
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);

  if (!user) {
    return (
      <section className="px-8 py-12 bg-white">
        <div className="container mx-auto text-center">
          <Typography variant="h4" color="gray">
            Please login to view your posts
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-12 bg-white">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
              My Posts
            </Typography>
            <Typography variant="paragraph" className="!text-gray-600">
              Manage your posts and create new content
            </Typography>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              size="sm" 
              color="blue"
              onClick={() => setShowCreatePost(!showCreatePost)}
            >
              {showCreatePost ? "Hide Create Post" : "Create New Post"}
            </Button>
          </div>
        </div>

        {/* Create Post Form */}
        {showCreatePost && (
          <div className="mb-8">
            <CreatePostForm userId={user.userID} />
          </div>
        )}

        {/* User Posts Manager */}
        <UserPostsManager userId={user.userID} />
      </div>
    </section>
  );
}

export default UserPosts;
