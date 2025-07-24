"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Avatar,
  Button,
} from "@material-tailwind/react";
import { User } from "@/components/types/auth";
import { UserIcon, CalendarIcon, PencilIcon, EnvelopeIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/components/context/AuthContext";
import EditProfileModal from "./edit-profile-modal";

interface UserProfileHeaderProps {
  readonly user: User;
  readonly userId: number;
  readonly postsCount: number;
}

export default function UserProfileHeader({ user, userId, postsCount }: UserProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(user);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const isOwnProfile = currentUser?.id === userId;

  // Debug log for currentUser?.userID
  console.log('currentUser?.userID:', currentUser?.userID, 'userId:', userId);

  useEffect(() => {
    setUserProfile(user);
  }, [user]);

  // Prefill modal with latest userProfile when opening
  const handleOpenEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleProfileUpdated = (updatedUser: any) => {
    setUserProfile(prev => ({ ...prev, ...updatedUser }));
  };

  return (
    <>
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar
              src={userProfile.avatar || `/image/avatar${userId % 3 + 1}.jpg`}
              alt={userProfile.fullName || userProfile.username}
              size="xxl"
              className="ring-4 ring-blue-500/20"
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <Typography variant="h2" color="blue-gray" className="mb-2">
                    {userProfile.fullName || userProfile.username}
                  </Typography>
                  <Typography variant="h6" color="gray" className="mb-2">
                    @{userProfile.username}
                  </Typography>
                </div>
                {/* Profile Action Button - Only for own profile */}
                {isOwnProfile && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outlined"
                      color="blue"
                      className="flex items-center gap-2"
                      onClick={handleOpenEditProfile}
                    >
                      <UserCircleIcon className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>
              {/* Bio Section */}
              {userProfile.bio && (
                <div className="mb-4">
                  <Typography variant="paragraph" color="gray" className="text-gray-700 max-w-lg">
                    {userProfile.bio}
                  </Typography>
                </div>
              )}
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <UserIcon className="h-4 w-4" />
                  <Typography variant="small">
                    @{userProfile.username}
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
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4" />
                <Typography variant="paragraph" color="gray" className="max-w-lg">
                  {userProfile.email}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onProfileUpdated={handleProfileUpdated}
        user={userProfile}
      />
    </>
  );
}
