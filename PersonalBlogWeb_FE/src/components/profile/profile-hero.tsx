"use client";

import Image from "next/image";
import { Button, Typography, Avatar, IconButton } from "@material-tailwind/react";
import { PencilIcon, CameraIcon } from "@heroicons/react/24/outline";

function ProfileHero() {
  return (
    <header className="mt-5 bg-white p-8">
      <div className="w-full container mx-auto pt-12 pb-24">
        {/* Cover Photo Section */}
        <div className="relative mb-8">
          <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
            <Image
              width={1200}
              height={320}
              src="/image/blog-background.png"
              alt="Profile cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <IconButton variant="filled" color="white" className="!text-blue-gray-900">
                <CameraIcon className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
          
          {/* Profile Avatar */}
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <Avatar
                src="/image/avatar1.jpg"
                alt="Profile"
                size="xxl"
                className="border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-2 right-2">
                <IconButton variant="filled" color="white" size="sm" className="!text-blue-gray-900">
                  <CameraIcon className="h-3 w-3" />
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Header Info */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between pl-8 pt-12">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <Typography
                as="h1"
                variant="h2"
                color="blue-gray"
                className="font-bold"
              >
                John Doe
              </Typography>
              <IconButton variant="text" size="sm">
                <PencilIcon className="h-4 w-4" />
              </IconButton>
            </div>
            <Typography
              variant="lead"
              className="!text-gray-600 mb-1"
            >
              Full Stack Developer & Tech Blogger
            </Typography>
            <Typography
              variant="small"
              className="!text-gray-500 mb-4"
            >
              @johndoe • Joined March 2023
            </Typography>
            <Typography
              variant="paragraph"
              className="!text-gray-700 max-w-2xl"
            >
              Passionate about web development, sharing knowledge through writing, and building 
              amazing user experiences. Love to explore new technologies and contribute to the 
              developer community.
            </Typography>
          </div>
          
          <div className="flex gap-3 mt-6 lg:mt-0">
            <Button variant="outlined" size="md">
              Edit Profile
            </Button>
            <Button size="md" color="blue">
              Follow
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap gap-8 mt-8 pl-8">
          <div className="text-center">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              24
            </Typography>
            <Typography variant="small" className="!text-gray-600">
              Posts
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              1.2K
            </Typography>
            <Typography variant="small" className="!text-gray-600">
              Followers
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              856
            </Typography>
            <Typography variant="small" className="!text-gray-600">
              Following
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              5.4K
            </Typography>
            <Typography variant="small" className="!text-gray-600">
              Likes
            </Typography>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ProfileHero;
