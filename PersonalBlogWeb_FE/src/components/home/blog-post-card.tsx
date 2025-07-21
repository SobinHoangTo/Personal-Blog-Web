"use client";

import React from "react";
import Image from "next/image";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
} from "@material-tailwind/react";
import { HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

interface BlogPostCardProps {
  thumbnail: string;
  categoryName: string;
  title: string;
  content: string;
  authorName: string; 
  authorAvatar: string
  createdDate: string;
  likeCount?: number;
  commentCount?: number;
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
  thumbnail,
  categoryName,
  title,
  content,
  authorName,
  authorAvatar,
  createdDate,
  likeCount = 0,
  commentCount = 0,
}: Readonly<BlogPostCardProps>) {
  const plainText = stripHtmlTags(content || "");
  const shortText = plainText.length > 250 ? plainText.slice(0, 250) + "..." : plainText;

  return (
    <Card shadow={true} className="h-[460px] flex flex-col justify-between">
      <CardHeader className="relative h-[180px] overflow-hidden">
        <Image
          width={768}
          height={768}
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </CardHeader>

      <CardBody className="p-6 flex flex-col justify-between h-full">
        <div>
          <Typography variant="small" color="blue" className="mb-2 !font-medium">
            {categoryName}
          </Typography>
          <Typography
            as="a"
            href="#"
            variant="h5"
            color="blue-gray"
            className="mb-2 normal-case transition-colors hover:text-gray-900"
          >
            {title}
          </Typography>
          <Typography
            className="mb-6 font-normal !text-gray-500 line-clamp-3 text-sm leading-relaxed"
          >
            {shortText}
          </Typography>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4">
            <Avatar
              size="sm"
              variant="circular"
              className="!border-2 !border-white"
              src={authorAvatar}
              alt={authorName}
            />
            <div>
              <Typography  variant="small" color="blue-gray" className="mb-0.5 !font-medium">
                {authorName}
              </Typography>
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
            <div className="flex items-center gap-1">
              <HeartIcon className="h-4 w-4 text-red-500" />
              <Typography variant="small" className="text-gray-600">
                {likeCount}
              </Typography>
            </div>
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
