import { Post } from "@/components/types/post";

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
    authorName: p.authorName,
    authorAvatar: p.authorAvatar,
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
