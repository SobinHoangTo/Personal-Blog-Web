"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button, Input, Typography, Card, CardBody, Chip } from "@material-tailwind/react";
import { approvePost, rejectPost, restorePost, softDeletePost, getAllPostsForAdmin, getAllPosts } from "@/lib/api";
import { Post } from "@/components/types/post";


export default function AdminPostsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "0") {
      // router.replace("/forbidden");
      return;
    }
    getAllPostsForAdmin()
    // getAllPosts()
      .then(posts => {
        console.log(posts);
        setPosts(posts)
      })
      .catch(() => setError("Failed to load posts"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    // Simple client-side search for demo; replace with API search if needed
    setTimeout(() => {
      setSearching(false);
    }, 300);
  };

  const handleApprove = async (id: number) => {
    await approvePost(id);
    setPosts(posts.map(p => p.id === id ? { ...p, status: 1 } : p));
  };
  const handleReject = async (id: number) => {
    await rejectPost(id);
    setPosts(posts.map(p => p.id === id ? { ...p, status: 99 } : p));
  };
  const handleRestore = async (id: number) => {
    await restorePost(id);
    setPosts(posts.map(p => p.id === id ? { ...p, status: 1 } : p));
  };
  const handleDelete = async (id: number) => {
    await softDeletePost(id);
    setPosts(posts.filter(p => p.id !== id));
  };

  // Filter posts by search
  const filteredPosts = search.trim() === ""
    ? posts
    : posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="red">{error}</Typography>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Typography variant="h3" className="mb-6">Post Management</Typography>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          label="Search by title or content"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" color="blue" disabled={searching}>Search</Button>
      </form>
      <Card>
        <CardBody>
          <Typography variant="h5" className="mb-4">Posts</Typography>
          <ul className="space-y-4">
            {filteredPosts.map(post => {
              const postStatus = post.status;
              return (
                <li key={post.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-2">
                  <div className="flex-1">
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography variant="small" color="blue">{post.categoryName} | by {post.authorName}</Typography>
                    <Typography variant="small" color="gray">{new Date(post.createdDate).toLocaleString()}</Typography>
                    <div className="mt-2 line-clamp-2 text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content }} />
                    <Typography variant="small" color={postStatus === 0 ? "amber" : postStatus === 1 ? "green" : postStatus === 99 ? "gray" : "blue"}
                      className="pr-2 pl-2 font-bold rounded-md">{postStatus === 0 ? "Is Pending" : postStatus === 1 ? "Is Approved" : postStatus === 99 ? "Is Deleted" : "Other"}</Typography>
                  </div>
                  
                  <div className="flex gap-2 items-center mt-2 md:mt-0">
                  {/* <Chip className="pr-2 pl-2 font-bold text-white rounded-md"
                      color={postStatus === 0 ? "amber" : postStatus === 1 ? "green" : postStatus === 99 ? "gray" : "blue"}
                      value={postStatus === 0 ? "Is Pending" : postStatus === 1 ? "Is Approved" : postStatus === 99 ? "Is Deleted" : "Other"}
                      size="sm"
                    /> */}
                    {postStatus === 0 && (
                      <>
                        <Button size="sm" color="green" onClick={() => handleApprove(post.id)}>Approve</Button>
                        <Button size="sm" color="red" onClick={() => handleReject(post.id)}>Reject</Button>
                      </>
                    )}
                    {postStatus === 1 && (
                      <Button size="sm" color="red" onClick={() => handleReject(post.id)}>Delete</Button>
                    )}
                    {postStatus === 99 && (
                      <Button size="sm" color="orange" onClick={() => handleRestore(post.id)}>Restore</Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
} 