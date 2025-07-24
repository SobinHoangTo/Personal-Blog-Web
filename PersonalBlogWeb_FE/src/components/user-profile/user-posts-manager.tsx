import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Button, Chip, Menu, MenuHandler, MenuList, MenuItem, IconButton } from "@material-tailwind/react";
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Post } from "@/components/types/post";
import { getUserPosts, softDeletePost } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import Image from "next/image";
import EditPostModal from "./edit-post-modal";

interface PostWithStatus extends Post {
  postID: number;
  status: number;
  createDate: string;
  likesCount: number;
  commentsCount: number;
  authorID: number;
}

interface UserPostsManagerProps {
  readonly userId: number;
}

export default function UserPostsManager({ userId }: UserPostsManagerProps) {
  const [posts, setPosts] = useState<PostWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<PostWithStatus | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();
  const isOwnProfile = user?.userID === userId;
  const isAdmin = user?.role === "1"; // Admin role
  const isStaff = user?.role === "2"; // Staff role

  const statusColors: { [key: number]: "amber" | "green" | "red" | "gray" } = {
    0: "amber", // pending
    1: "green", // approved
    2: "red",   // rejected
    99: "gray"  // soft deleted
  };

  const statusLabels = {
    0: "Pending",
    1: "Published",
    2: "Rejected", 
    99: "Deleted"
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userPosts = await getUserPosts(userId);
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleSoftDelete = async (postId: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await softDeletePost(postId);
      setPosts(posts.map(post => 
        post.postID === postId 
          ? { ...post, status: 99 } 
          : post
      ));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handleEditPost = (post: PostWithStatus) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handlePostUpdated = (updatedPost: any) => {
    setPosts(posts.map(post => 
      post.postID === updatedPost.postID 
        ? { ...post, ...updatedPost } 
        : post
    ));
    setIsEditModalOpen(false);
    setEditingPost(null);
  };

  const canEditPost = (post: PostWithStatus) => {
    return isOwnProfile && post.authorID === user?.userID;
  };

  const canDeletePost = (post: PostWithStatus) => {
    return isOwnProfile && post.authorID === user?.userID || isAdmin || isStaff;
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Typography>Loading posts...</Typography>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <Typography color="gray">No posts found</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        {isOwnProfile ? "My Posts" : "Posts"}
      </Typography>
      
      {posts.map((post) => (
        <Card key={post.postID} className="shadow-md">
          <CardBody>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Typography variant="h6" color="blue-gray" className="line-clamp-1">
                    {post.title}
                  </Typography>
                  <Chip
                    size="sm"
                    color={statusColors[post.status]}
                    value={statusLabels[post.status as keyof typeof statusLabels]}
                  />
                </div>
                
                <Typography variant="small" color="gray" className="mb-2">
                  {formatDate(post.createDate)}
                </Typography>
                
                <Typography variant="paragraph" color="gray" className="line-clamp-3">
                  {truncateContent(post.content.replace(/<[^>]*>/g, ''))}
                </Typography>
              </div>

              {/* Action Menu - Role-based permissions */}
              {(canEditPost(post) || canDeletePost(post)) && post.status !== 99 && (
                <Menu>
                  <MenuHandler>
                    <IconButton variant="text" color="gray">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </IconButton>
                  </MenuHandler>
                  <MenuList
                  >
                    <MenuItem 
                      className="flex items-center gap-2"
                    >
                      <EyeIcon className="h-4 w-4" />
                      View Post
                    </MenuItem>
                    
                    {canEditPost(post) && (
                      <MenuItem 
                        className="flex items-center gap-2"
                        onClick={() => handleEditPost(post)}
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit Post
                      </MenuItem>
                    )}
                    
                    {canDeletePost(post) && (
                      <MenuItem 
                        className="flex items-center gap-2 text-red-500"
                        onClick={() => handleSoftDelete(post.postID)}
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete Post
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              )}
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="mt-4">
                <Image 
                  src={post.coverImage} 
                  alt={post.title}
                  width={800}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            
            {/* Post Stats */}
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <span>{post.likesCount || 0} likes</span>
              <span>{post.commentsCount || 0} comments</span>
            </div>
          </CardBody>
        </Card>
      ))}
      
      {/* Edit Post Modal */}
      {editingPost && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPost(null);
          }}
          post={editingPost}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </div>
  );
}
