"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
} from "@material-tailwind/react";
import { ArrowSmallDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import BlogPostCard from "@/components/home/blog-post-card";
import {
  getAllPosts,
  getPostsByCategory,
  getAllCategories,
  Post,
} from "@/lib/api";

interface Category {
  id: number;
  name: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]); // Store all posts for pagination
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const POSTS_PER_PAGE = 9;

  // Utility function to paginate posts
  const paginatePosts = (posts: Post[], page: number) => {
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return posts.slice(startIndex, endIndex);
  };

  // Update pagination info
  const updatePagination = (posts: Post[], page: number = 1) => {
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    setTotalPages(totalPages);
    setCurrentPage(page);
    const paginatedPosts = paginatePosts(posts, page);
    setPosts(paginatedPosts);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    updatePagination(allPosts, page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
      setTotalPages(totalPages);
      setCurrentPage(newPage);
      const paginatedPosts = paginatePosts(allPosts, newPage);
      setPosts(paginatedPosts);
    }
  };

  // Render pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    
    // Simple pagination: show all pages if 5 or less, otherwise show current +/- 2
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    // Always show first page if not in range
    if (startPage > 1) {
      buttons.push(
        <IconButton
          key={1}
          variant="outlined"
          size="sm"
          onClick={() => handlePageChange(1)}
        >
          1
        </IconButton>
      );
      if (startPage > 2) {
        buttons.push(<span key="start-ellipsis" className="px-2 text-gray-500">...</span>);
      }
    }
    
    // Show pages in range
    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <IconButton
          key={page}
          variant={page === currentPage ? "filled" : "outlined"}
          size="sm"
          onClick={() => handlePageChange(page)}
          className={page === currentPage ? "bg-blue-500" : ""}
        >
          {page}
        </IconButton>
      );
    }
    
    // Always show last page if not in range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="end-ellipsis" className="px-2 text-gray-500">...</span>);
      }
      buttons.push(
        <IconButton
          key={totalPages}
          variant="outlined"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </IconButton>
      );
    }
    
    return buttons;
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      const paginatedPosts = paginatePosts(allPosts, newPage);
      setPosts(paginatedPosts);
    }
  };

  // Fetch categories once
  useEffect(() => {
    getAllCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  // Fetch posts whenever selectedCategoryId changes
  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        let data: Post[] = [];
        if (selectedCategoryId === null) {
          data = await getAllPosts();
        } else {
          data = await getPostsByCategory(selectedCategoryId);
        }
        setAllPosts(data);
        
        // Update pagination
        const totalPages = Math.ceil(data.length / POSTS_PER_PAGE);
        setTotalPages(totalPages);
        setCurrentPage(1);
        const paginatedPosts = paginatePosts(data, 1);
        setPosts(paginatedPosts);
      } catch (err) {
        console.error("Lỗi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategoryId]);

  return (
    <section className="grid min-h-screen place-items-center p-8">
      <Tabs value="all" className="mx-auto max-w-7xl w-full mb-16">
        <div className="w-full flex mb-8 flex-col items-center">
          <TabsHeader
            className="h-10 !w-full md:w-[50rem] border border-white/25 bg-opacity-90 overflow-x-auto"
            indicatorProps={{ className: "bg-blue-500 shadow-none" }}
          >
            <Tab
              key="all"
              value="all"
              onClick={() => setSelectedCategoryId(null)}
              className={selectedCategoryId === null ? "text-white" : ""}
            >
              All
            </Tab>
            {categories.map((category) => (
              <Tab
                key={category.id}
                value={category.name}
                onClick={() => setSelectedCategoryId(category.id)}
                className={selectedCategoryId === category.id ? "text-white" : ""}
              >
                {category.name}
              </Tab>
            ))}
          </TabsHeader>
        </div>
      </Tabs>

      <Typography variant="h6" className="mb-2">
        Latest Blog Posts
      </Typography>
      <Typography variant="h1" className="mb-2">
        {selectedCategoryId === null
          ? "All News"
          : categories.find((cat) => cat.id === selectedCategoryId)?.name || ""}
      </Typography>
      <Typography
        variant="lead"
        color="gray"
        className="max-w-3xl mb-36 text-center text-gray-500"
      >
        Check out what&apos;s new in the web development and tech world!
      </Typography>

      {(() => {
        if (loading) {
          return (
            <Typography variant="h6" color="gray">
              Loading Posts...
            </Typography>
          );
        } else if (posts.length === 0) {
          return (
            <Typography variant="h6" color="gray">
              No posts found in this category.
            </Typography>
          );
        } else {
          return (
            <>
              <div className="container my-auto grid grid-cols-1 gap-x-8 gap-y-16 items-start lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogPostCard
                    key={post?.id}
                    title={post.title}
                    content={post.content}
                    thumbnail={post.coverImage || "/blog_background.jpg"}
                    categoryName={post.categoryName}
                    createdDate={post.createdDate}
                    authorName={post.authorName}
                    authorAvatar={post.authorAvatar}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <IconButton
                    variant="outlined"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="disabled:opacity-50"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </IconButton>

                  <div className="flex items-center gap-2">
                    {renderPaginationButtons()}
                  </div>

                  <IconButton
                    variant="outlined"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="disabled:opacity-50"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              )}

              {/* Pagination Info */}
              <div className="text-center mt-4">
                <Typography variant="small" color="gray">
                  Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1} to{" "}
                  {Math.min(currentPage * POSTS_PER_PAGE, allPosts.length)} of{" "}
                  {allPosts.length} posts
                </Typography>
              </div>
            </>
          );
        }
      })()}

      {/* VIEW MORE button - only show if no pagination needed */}
      {totalPages <= 1 && (
        <Button
          variant="text"
          size="lg"
          color="gray"
          className="flex items-center gap-2 mt-24"
        >
          <ArrowSmallDownIcon className="h-5 w-5 font-bold text-gray-900" />
          VIEW MORE
        </Button>
      )}
    </section>
  );
}
