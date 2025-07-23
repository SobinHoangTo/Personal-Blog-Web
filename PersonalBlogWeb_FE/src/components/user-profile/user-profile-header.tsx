"use client";

import React from "react";
import {
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { User } from "@/components/types/auth";
import { UserIcon, CalendarIcon, PencilIcon } from "@heroicons/react/24/outline";

interface UserProfileHeaderProps {
  user: User;
  userId: number;
  postsCount: number;
}

export default function UserProfileHeader({ user, userId, postsCount }: UserProfileHeaderProps) {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-6">
          <Avatar
            src={user.avatar || `/image/avatar${userId % 3 + 1}.jpg`}
            alt={user.fullName || user.username}
            size="xxl"
            className="ring-4 ring-blue-500/20"
          />
          <div>
            <Typography variant="h2" color="blue-gray" className="mb-2">
              {user.fullName || user.username}
            </Typography>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <Typography variant="small">
                  @{user.username}
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <PencilIcon className="h-4 w-4" />
                <Typography variant="small">
                  {postsCount} {postsCount === 1 ? 'Post' : 'Posts'}
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <Typography variant="small">
                  Member since {new Date().getFullYear()}
                </Typography>
              </div>
            </div>
            <Typography variant="paragraph" color="gray" className="max-w-lg">
              {user.email}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
