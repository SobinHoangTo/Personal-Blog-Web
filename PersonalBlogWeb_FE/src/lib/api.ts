import { Post } from "@/components/types/post";
import { Category } from "@/components/types/category";

// lib/api.ts
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllPosts(): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/Posts`);

  if (!res.ok) {
    console.error("Fetch error:", res.status, res.statusText);
    throw new Error("Failed to fetch posts");
  }

  const posts = await res.json();

  return posts.map((p: any) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    coverImage: p.coverImage || "/blog_background.jpg",
    createdDate: p.createdDate,
    categoryName: p.categoryName,
    likeCount: p.likeCount,
    commentCount: p.commentCount,
    authorID: p.authorID,
    authorName: p.authorName,
    authorAvatar: p.authorAvatar,
    status: p.status,
  }));
}

export async function getAllPostsForAdmin(): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/Posts/admin`);
  if (!res.ok) {
    throw new Error("Failed to fetch posts for admin");
  }
  const posts = await res.json();
  return posts.map((p: any) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    coverImage: p.coverImage || "/blog_background.jpg",
    createdDate: p.createdDate,
    categoryName: p.categoryName,
    likeCount: p.likeCount,
    commentCount: p.commentCount,
    authorID: p.authorID,
    authorName: p.authorName,
    authorAvatar: p.authorAvatar,
    status: p.status,
  }));
}

export async function fetchPostById(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/Posts/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch post with id ${id}`);
  }
  return res.json();
}

export async function fetchPostsByCategory(category: string): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/Posts?category=${category}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch posts for category ${category}`);
  }
  return res.json();
}

export async function getAllCategories() {
  try {
    const res = await fetch(`${BASE_URL}/Categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getPostsByCategory(categoryId: number) {
  try {
    const res = await fetch(`${BASE_URL}/Posts/category/${categoryId}`);
    if (!res.ok) throw new Error("Failed to fetch posts by category");
    return await res.json();
  } catch (error) {
    console.error("Lỗi tải posts theo category:", error);
    return [];
  }
}

export async function getPostById(id: number) {
  try {
    const res = await fetch(`${BASE_URL}/Posts/${id}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    return await res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function getPostComments(postId: number) {
  try {
    const res = await fetch(`${BASE_URL}/Comment/post/${postId}`);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return await res.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function createComment(
  postId: number,
  content: string,
  parentCommentId?: number
) {
  try {
    const res = await fetch(`${BASE_URL}/Comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        postId,
        content,
        parentCommentId,
      }),
    });
    if (!res.ok) throw new Error("Failed to create comment");
    return await res.json();
  } catch (error) {
    console.error("Error creating comment:", error);
    return null;
  }
}

export async function getCommentLikes(commentId: number) {
  try {
    const res = await fetch(`${BASE_URL}/Likes/comment/${commentId}`);
    if (!res.ok) throw new Error("Failed to fetch comment likes");
    return await res.json();
  } catch (error) {
    console.error("Error fetching comment likes:", error);
    return [];
  }
}

// Auth API functions
export async function loginUser(username: string, password: string) {
  try {
    const res = await fetch(`${BASE_URL}/Users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function registerUser(userData: any) {
  try {
    const res = await fetch(`${BASE_URL}/Users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
}

// Google OAuth login
export function initiateGoogleLogin() {
  // Redirect to backend Google login endpoint
  window.location.href = `${BASE_URL}/Users/google-login`;
}

// User API functions
export async function getUserById(userId: number) {
  try {
    const res = await fetch(`${BASE_URL}/Users/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return await res.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getUserPosts(authorId: number) {
  try {
    const res = await fetch(`${BASE_URL}/Posts/author/${authorId}`);
    if (!res.ok) throw new Error("Failed to fetch user posts");
    return await res.json();
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
}

// Enhanced comment functions with authentication
export async function createCommentAuth(
  postId: number,
  content: string,
  parentCommentId?: number
) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const res = await fetch(`${BASE_URL}/Comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        postId,
        content,
        parentCommentId,
      }),
    });
    if (!res.ok) throw new Error("Failed to create comment");
    return await res.json();
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}

export async function likeComment(commentId: number) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const res = await fetch(`${BASE_URL}/Like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        commentId: commentId,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Like comment error response:", errorText);
      throw new Error(`Failed to like comment: ${errorText}`);
    }

    const result = await res.json();
    console.log("Like comment response:", result);
    return result;
  } catch (error) {
    console.error("Error liking comment:", error);
    throw error;
  }
}

// Like/Unlike Post
export async function likePost(postId: number) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const res = await fetch(`${BASE_URL}/Like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        postId: postId,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Like post error response:", errorText);
      throw new Error(`Failed to like post: ${errorText}`);
    }

    const result = await res.json();
    console.log("Like post response:", result);
    return result;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}

// Update Comment
export async function updateComment(commentId: number, content: string) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const res = await fetch(`${BASE_URL}/Comment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        commentId: commentId,
        content: content,
      }),
    });
    if (!res.ok) throw new Error("Failed to update comment");
    return await res.json();
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
}

// Delete Comment
export async function deleteComment(commentId: number) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const res = await fetch(`${BASE_URL}/Comment/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete comment");
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

// Create Post
export async function createPost({
  title,
  content,
  categoryId,
  status,
  coverImage,
}: {
  title: string;
  content: string;
  categoryId: number;
  status?: number;
  coverImage?: string;
}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/Posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      content,
      categoryId,
      status: status ?? 0,
      coverImage,
    }),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return await res.json();
}

export async function updateUserProfile({
  fullName,
  bio,
  avatar,
}: {
  fullName: string;
  bio: string;
  avatar: string;
}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/Users/update-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fullName,
      bio,
      avatar,
    }),
  });

  if (!res.ok) throw new Error("Failed to update profile");
  return await res.json();
}

export async function softDeletePost(postId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/Posts/${postId}/soft-delete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete post");
  return await res.json();
}

export async function updatePost(
  postId: number,
  postData: {
    title: string;
    content: string;
    categoryId: number;
    coverImage?: string;
  }
) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${BASE_URL}/Posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!res.ok) throw new Error("Failed to update post");
  return await res.json();
}

// Admin Category Management
export async function createCategory(category: {
  name: string;
  description?: string;
}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/Categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return await res.json();
}

export async function updateCategory(
  id: number,
  category: { name: string; description?: string }
) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/Categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, ...category }),
  });
  if (!res.ok) throw new Error("Failed to update category");
  if (res.status === 204) return true;
  return await res.json();
}

export async function fetchCategoryById(id: number): Promise<Category> {
  const res = await fetch(`${BASE_URL}/Categories/${id}`);
  if (!res.ok) throw new Error("Failed to fetch category");
  return await res.json();
}

// Admin Account Management
export async function getAllAccounts() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/Users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch accounts");
  return await res.json();
}

export async function createStaffAccount({
  username,
  fullName,
  email,
  password,
}: {
  username: string;
  fullName: string;
  email: string;
  password: string;
}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/Users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, fullName, email, password }),
  });
  if (!res.ok) throw new Error("Failed to create staff account");
  return await res.json();
}

export async function banAccount(id: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/Users/ban/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to ban account");
  return true;
}

export async function unbanAccount(id: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/Users/unban/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to unban account");
  return true;
}

export async function deleteAccount(id: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/Users/delete-user/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete account");
  return true;
}

export async function searchAccounts(query: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(
    `${BASE_URL}/Users/search?query=${encodeURIComponent(query)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Failed to search accounts");
  // Convert role to string for frontend consistency
  const users = await res.json();
  return users.map((u: any) => ({ ...u, role: u.role?.toString() ?? "" }));
}

export async function approvePost(postId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/Posts/${postId}/approve`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to approve post");
  return true;
}

export async function rejectPost(postId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/Posts/${postId}/reject`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to reject post");
  return true;
}

export async function restorePost(postId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication required");
  const res = await fetch(`${BASE_URL}/Posts/${postId}/restore`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to restore post");
  return true;
}
