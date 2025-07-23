// components
import { Footer, Navbar } from "@/components";
import { ProfileHero, ProfileInfo, UserPosts } from "@/components/profile";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <ProfileHero />
      <ProfileInfo />
      <UserPosts />
      <Footer />
    </>
  );
}
