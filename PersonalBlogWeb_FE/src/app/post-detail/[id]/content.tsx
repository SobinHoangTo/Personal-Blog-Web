"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Typography, Chip, Avatar } from "@material-tailwind/react";
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon } from "@heroicons/react/24/outline";
import { getPostById } from "@/lib/api";
import { Post } from "@/components/types/post";


type ContentProps = {
  postId: string;
};

export default function Content({ postId }: Readonly<ContentProps>) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(Number(postId));
        if (data) {
          setPost(data);
          setError(null);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement API call to like/unlike post
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content?.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <section className="py-12 px-8">
        <div className="mx-auto max-w-screen-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <Typography variant="paragraph" color="gray" className="mt-4">
            Loading post...
          </Typography>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="py-12 px-8">
        <div className="mx-auto max-w-screen-md text-center">
          <Typography color="red" variant="h4">
            {error || "Post not found"}
          </Typography>
        </div>
      </section>
    );
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to strip HTML tags from content
  const stripHtmlTags = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <section className="py-12 px-8">
      <div className="mx-auto max-w-screen-md">
        {/* Category Badge */}
        <Chip
          value={post.categoryName}
          variant="gradient"
          color="blue"
          className="mb-4 w-fit"
        />

        {/* Post Title */}
        <Typography variant="h2" color="blue-gray" className="mb-6 leading-tight">
          {post.title}
        </Typography>

        {/* Post Meta Information */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
          <Avatar
            src={post.authorAvatar || "/image/avatar1.jpg"}
            alt={post.authorName}
            size="md"
          />
          <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray">
              {post.authorName}
            </Typography>
            <div className="flex items-center gap-2">
              <Typography variant="small" color="gray">
                {formatDate(post.createdDate)}
              </Typography>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-1">
              <HeartIcon className="h-4 w-4 text-red-500" />
              <Typography variant="small" color="gray">
                {post.likeCount}
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              <ChatBubbleLeftIcon className="h-4 w-4 text-blue-500" />
              <Typography variant="small" color="gray">
                {post.commentCount}
              </Typography>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <Image
          width={768}
          height={500}
          src={post.coverImage || "/image/blog-background.png"}
          alt={post.title}
          className="mb-8 h-[28rem] w-full rounded-xl object-cover"
        />

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <Button
              variant={isLiked ? "filled" : "outlined"}
              size="sm"
              className="flex items-center gap-2"
              onClick={handleLike}
              color={isLiked ? "red" : "gray"}
            >
              <HeartIcon className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              Like ({post.likeCount + (isLiked ? 1 : 0)})
            </Button>
            <Button
              variant="outlined"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                // Scroll to comments section
                const commentsSection = document.getElementById("comments");
                if (commentsSection) {
                  commentsSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <ChatBubbleLeftIcon className="h-4 w-4" />
              Comment ({post.commentCount})
            </Button>
            <Button
              variant="outlined"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleShare}
            >
              <ShareIcon className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Author Section */}
        <div className="mt-16 p-6 bg-gray-50 rounded-xl">
          <Typography variant="h5" color="blue-gray" className="mb-4">
            About the Author
          </Typography>
          <div className="flex items-start gap-4">
            <Avatar
              src={post.authorAvatar || "/image/avatar1.jpg"}
              alt={post.authorName}
              size="xl"
            />
            <div className="flex-1">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                {post.authorName}
              </Typography>
              <Typography className="text-gray-600 mb-4">
                Content creator and blogger passionate about technology and web development.
              </Typography>
              <Button size="sm" variant="outlined">
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
