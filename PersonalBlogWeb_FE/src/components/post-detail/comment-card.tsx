"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Typography,
  Card,
  CardBody,
  Button,
} from "@material-tailwind/react";
import { 
  ArrowUturnLeftIcon, 
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useAuth } from "@/components/context/AuthContext";


interface CommentCardProps {
  img: string;
  name: string;
  desc: string;
  hours?: string;
  likeCount?: number;
  isLiked?: boolean;
  onLike?: () => void;
  onReply?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isReply?: boolean;
  authorId?: number;
  commentId?: number;
}

export function CommentCard({ 
  img, 
  name, 
  desc, 
  hours, 
  likeCount = 0, 
  isLiked = false, 
  onLike, 
  onReply, 
  onEdit,
  onDelete,
  isReply = false,
  authorId,
  commentId
}: Readonly<CommentCardProps>) {
  const { user } = useAuth();
  const isOwner = user && authorId && user.id === authorId;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const formatLikeText = () => {
    if (likeCount === 0) return 'Like';
    if (likeCount === 1) return '1 Like';
    return `${likeCount} Likes`;
  };

  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showMenu]);
  return (
    <Card
      shadow={false}
      color="transparent"
      className="grid items-center gap-6 "
    >
      <CardBody className="p-0 gap-5 flex ">
        <div className=" !m-0 h-full  w-full  max-h-[40px] max-w-[40px] ">
          <Link href={`/user/${authorId || 0}`}>
            <Image
              width={768}
              height={768}
              src={img}
              alt="img"
              className="h-full rounded w-full object-cover object-center"
            />
          </Link>
        </div>
        <div>
          <div className="flex gap-1 mb-3 items-center justify-between">
            <div className="flex gap-1 items-center">
              {authorId ? (
                <Link href={`/user/${authorId || 0}`}>
                  <Typography
                    variant="small"
                    className=" font-bold flex items-center gap-2 !text-gray-900 hover:text-blue-500 cursor-pointer"
                  >
                    {name}
                  </Typography>
                </Link>
              ) : (
                <Typography
                  variant="small"
                  className=" font-bold flex items-center gap-2 !text-gray-900"
                >
                  {name}
                </Typography>
              )}
              {hours && (
                <Typography variant="small" color="gray" className="font-normal">
                  {hours}
                </Typography>
              )}
            </div>
            
            {/* Edit/Delete Menu for comment owner */}
            {isOwner && (
              <div className="relative" ref={menuRef}>
                <Button
                  variant="text"
                  size="sm"
                  className="p-1 h-6 w-6 rounded-full"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <EllipsisVerticalIcon className="h-4 w-4" />
                </Button>
                
                {showMenu && (
                  <div className="absolute right-0 top-8 z-10 bg-white shadow-lg rounded-md border border-gray-200 py-1 min-w-[120px]">
                    <button
                      onClick={() => {
                        onEdit?.();
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.();
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-500"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <Typography className="w-full font-normal mb-4 !text-gray-500">
            {desc}
          </Typography>
          <div className="!w-full flex justify-end">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="text"
                color="gray"
                className="flex items-center gap-1 flex-shrink-0"
                onClick={onReply}
              >
                <ArrowUturnLeftIcon className="w-4 text-4 h-4" />
                Reply
              </Button>
              <Button
                size="sm"
                variant="text"
                className={`flex items-center gap-1 flex-shrink-0 ${
                  isLiked ? 'text-red-500' : 'text-gray-500'
                }`}
                onClick={onLike}
              >
                <HeartIcon className={`w-4 h-4 ${isLiked ? 'text-red-500' : ''}`} />
                {formatLikeText()}
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

  export default CommentCard;