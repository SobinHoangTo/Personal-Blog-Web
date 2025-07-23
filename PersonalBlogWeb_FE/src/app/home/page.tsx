// components
import { Footer, Navbar } from "@/components";
import Hero from "./hero";
import PostList from "./post-list";
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
