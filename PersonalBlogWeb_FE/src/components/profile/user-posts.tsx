"use client";

import { Typography, Card, CardBody, CardHeader, Button, Chip } from "@material-tailwind/react";
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ShareIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

function UserPosts() {
  const posts = [
    {
      id: 1,
      title: "Building Scalable React Applications with TypeScript",
      excerpt: "Learn how to structure large React applications using TypeScript for better maintainability and developer experience.",
      image: "/image/blog-background.png",
      category: "React",
      readTime: "8 min read",
      publishedAt: "2 days ago",
      likes: 42,
      comments: 8,
      isLiked: true,
      isBookmarked: false
    },
    {
      id: 2,
      title: "Next.js 14: What's New and How to Migrate",
      excerpt: "Explore the latest features in Next.js 14 including App Router improvements, Server Components enhancements, and migration strategies.",
      image: "/image/blog-background.png",
      category: "Next.js",
      readTime: "12 min read",
      publishedAt: "1 week ago",
      likes: 67,
      comments: 15,
      isLiked: false,
      isBookmarked: true
    },
    {
      id: 3,
      title: "Mastering Tailwind CSS: Advanced Tips and Tricks",
      excerpt: "Discover advanced Tailwind CSS techniques to create beautiful, responsive designs with minimal custom CSS.",
      image: "/image/blog-background.png",
      category: "CSS",
      readTime: "6 min read",
      publishedAt: "2 weeks ago",
      likes: 38,
      comments: 12,
      isLiked: true,
      isBookmarked: false
    }
  ];

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
              Articles and tutorials I&apos;ve written to share knowledge with the community
            </Typography>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outlined" size="sm">
              All Posts
            </Button>
            <Button variant="outlined" size="sm">
              Drafts
            </Button>
            <Button size="sm" color="blue">
              New Post
            </Button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader floated={false} className="h-48 m-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </CardHeader>
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Chip
                    value={post.category}
                    variant="gradient"
                    color="blue"
                    size="sm"
                    className="rounded-full"
                  />
                  <div className="flex items-center gap-1">
                    <Typography variant="small" className="text-gray-600">
                      {post.readTime}
                    </Typography>
                    <span className="text-gray-400">•</span>
                    <Typography variant="small" className="text-gray-600">
                      {post.publishedAt}
                    </Typography>
                  </div>
                </div>

                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mb-3 font-bold leading-snug hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {post.title}
                </Typography>

                <Typography
                  variant="paragraph"
                  className="!text-gray-700 mb-4 line-clamp-3"
                >
                  {post.excerpt}
                </Typography>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      {post.isLiked ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                      <Typography variant="small" className="font-medium">
                        {post.likes}
                      </Typography>
                    </button>

                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <Typography variant="small" className="font-medium">
                        {post.comments}
                      </Typography>
                    </button>

                    <button className="hover:text-blue-500 transition-colors">
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className={`hover:text-yellow-600 transition-colors ${post.isBookmarked ? 'text-yellow-600' : ''}`}>
                      <BookmarkIcon className="h-5 w-5" />
                    </button>
                    <button className="hover:text-gray-600 transition-colors">
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outlined" size="lg" className="min-w-32">
            Load More Posts
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Typography variant="h4" color="blue-gray" className="font-bold mb-6 text-center">
            Writing Statistics
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
                24
              </Typography>
              <Typography variant="paragraph" className="text-gray-600">
                Total Posts
              </Typography>
            </div>
            <div>
              <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
                5.2K
              </Typography>
              <Typography variant="paragraph" className="text-gray-600">
                Total Views
              </Typography>
            </div>
            <div>
              <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
                148
              </Typography>
              <Typography variant="paragraph" className="text-gray-600">
                Total Likes
              </Typography>
            </div>
            <div>
              <Typography variant="h3" color="blue-gray" className="font-bold mb-2">
                67
              </Typography>
              <Typography variant="paragraph" className="text-gray-600">
                Total Comments
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserPosts;
