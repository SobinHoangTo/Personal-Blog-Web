"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
} from "@material-tailwind/react";
import { HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import { BlogPostCardProps } from "../types/post";
import { likePost } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";


interface BlogPostCardExtendedProps extends BlogPostCardProps {
  currentUser: any;
  postAuthor: any;
  onEdit?: () => void;
  onDelete?: () => void;
}

function stripHtmlTags(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPostCard({
  id,
  coverImage,
  categoryName,
  title,
  content,
  authorID,
  authorName,
  authorAvatar,
  createdDate,
  likeCount = 0,
  commentCount = 0,
  currentUser,
  postAuthor,
  onEdit,
  onDelete,
}: Readonly<BlogPostCardExtendedProps>) {
  const plainText = stripHtmlTags(content || "");
  const shortText = plainText.length > 250 ? plainText.slice(0, 250) + "..." : plainText;
  const { isAuthenticated } = useAuth();
  
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

  // Initialize like status - for now we'll use optimistic updates
  useEffect(() => {
    setIsLiked(false); // Default to not liked
    setCurrentLikeCount(likeCount);
  }, [id, isAuthenticated, likeCount]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking like button
    
    if (!isAuthenticated) {
      alert("Please login to like posts");
      return;
    }

    try {
      const result = await likePost(id);
      // Update like status based on server response
      const newIsLiked = result.message === "Liked";
      setIsLiked(newIsLiked);
      setCurrentLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Failed to like post. Please try again.");
    }
  };

  // Permission logic
  const isOwner = currentUser && currentUser.id === authorID;
  const isAdmin = currentUser && currentUser.role === "0";
  const isStaff = currentUser && currentUser.role === "2";
  const canEdit = isOwner;
  const canDelete = isAdmin || isStaff || isOwner;

  return (
    <Card shadow={true} className="h-[460px] flex flex-col justify-between">
      <CardHeader className="relative h-[450px] overflow-hidden">
        <Link href={`/post-detail/${id}`}>
        <Image
          width={768}
          height={768}
          src={coverImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        </Link>
      </CardHeader>

      <CardBody className="p-6 flex flex-col justify-between h-full">
        <div>
          <Typography variant="small" color="blue" className="mb-2 !font-medium">
            {categoryName}
          </Typography>
          <Link href={`/post-detail/${id}`}>
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 normal-case transition-colors hover:text-gray-900"
            >
              {title}
            </Typography>
          </Link>
          <Typography
            className="mb-6 font-normal !text-gray-500 line-clamp-3 text-sm leading-relaxed"
          >
            {shortText}
          </Typography>
          {/* Edit/Delete Buttons */}
          <div className="flex gap-2 mt-2">
            {canEdit && (
              <button className="text-blue-500 hover:underline text-sm" onClick={onEdit}>Edit</button>
            )}
            {canDelete && (
              <button className="text-red-500 hover:underline text-sm" onClick={onDelete}>Delete</button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4">
            <Link href={`/user/${authorID}`}>
              <Avatar
                size="sm"
                variant="circular"
                className="!border-2 !border-white"
                src={authorAvatar}
                alt={authorName}
              />
            </Link>
            <div>
              <Link href={`/user/${authorID}`}>
                <Typography variant="small" color="blue-gray" className="mb-0.5 !font-medium">
                  {authorName}
                </Typography>
              </Link>
              <Typography
                variant="small"
                color="gray"
                className="text-xs !text-gray-500 font-normal"
              >
                {formatDate(createdDate)}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1 hover:scale-110 transition-transform"
            >
              {isLiked ? (
                <HeartIconSolid className="h-4 w-4 text-red-500" />
              ) : (
                <HeartIcon className="h-4 w-4 text-red-500" />
              )}
              <Typography variant="small" className="text-gray-600">
                {currentLikeCount}
              </Typography>
            </button>
            <div className="flex items-center gap-1">
              <ChatBubbleLeftIcon className="h-4 w-4 text-blue-500" />
              <Typography variant="small" className="text-gray-600">
                {commentCount}
              </Typography>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default BlogPostCard;
