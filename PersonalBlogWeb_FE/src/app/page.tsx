// components
import { Footer, Navbar } from "@/components";
import Hero from "./home/hero";
import PostList from "./home/post-list";
// sections

export default function Campaign() {
  return (
    <>
      <Navbar />
      <Hero />
      <PostList />
      <Footer />
    </>
  );
}
