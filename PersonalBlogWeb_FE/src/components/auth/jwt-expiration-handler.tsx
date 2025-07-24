import { useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

export default function JwtExpirationHandler() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Parse JWT token to get expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Check if token is expired
        if (payload.exp && payload.exp < currentTime) {
          console.log("Token expired, logging out...");
          logout();
          router.push("/login");
        }
      } catch (error) {
        console.error("Error parsing token:", error);
        // If token is malformed, logout
        logout();
        router.push("/login");
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Set up interval to check every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    // Also check on window focus (when user comes back to tab)
    const handleFocus = () => checkTokenExpiration();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [logout, router]);

  return null; // This component doesn't render anything
}
