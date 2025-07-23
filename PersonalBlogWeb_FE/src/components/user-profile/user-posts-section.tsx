"use client";

import React from "react";
import {
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { Post } from "@/components/types/post";
import { User } from "@/components/types/auth";
import BlogPostCard from "@/components/home/blog-post-card";
import { PencilIcon } from "@heroicons/react/24/outline";

interface UserPostsSectionProps {
  user: User;
  posts: Post[];
}

export default function UserPostsSection({ user, posts }: UserPostsSectionProps) {
  const getPostsText = () => {
    if (posts.length === 0) {
      return "No posts published yet";
    }
    const postWord = posts.length === 1 ? 'post' : 'posts';
    return `${posts.length} ${postWord} published`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Posts by {user.fullName || user.username}
        </Typography>
        <Typography variant="paragraph" color="gray">
          {getPostsText()}
        </Typography>
      </div>

      {posts.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardBody className="text-center py-12">
            <PencilIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Typography variant="h5" color="blue-gray" className="mb-2">
              No posts yet
            </Typography>
            <Typography variant="paragraph" color="gray">
              This user hasn&apos;t published any posts yet.
            </Typography>
          </CardBody>
        </Card>
      ) : (
        <div className="container my-auto grid grid-cols-1 gap-x-8 gap-y-16 items-start lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} {...post} coverImage={post.coverImage ?? ""} />
          ))}
        </div>
      )}
    </div>
  );
}
