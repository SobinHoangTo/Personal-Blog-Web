// lib/api.ts
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type Post = {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  createdDate: string;
  categoryName: string;
  authorName: string;
  authorAvatar: string;
  likeCount: number;
  commentCount: number;
};

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
