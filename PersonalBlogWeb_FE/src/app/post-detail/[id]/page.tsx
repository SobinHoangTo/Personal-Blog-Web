// post-detail/[id]/page.tsx

import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import Content from "./content";
import Comments from "./comments";
import BlogPosts from "./blog-posts";

// Lưu ý: nhận props từ Next.js
export default function PostDetailPage({ params }: Readonly<{ params: { id: string } }>) {
  const { id } = params;

  return (
    <>
      <Navbar />
      <Hero />
      <Content postId={id} />
      <Comments postId={parseInt(id)} />
      <BlogPosts />
      <Footer />
    </>
  );
}
