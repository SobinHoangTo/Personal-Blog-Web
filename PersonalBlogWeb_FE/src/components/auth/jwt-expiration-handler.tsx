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
        // Validate JWT format (must have 3 parts separated by dots)
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error("Invalid JWT format");
        }

        // Get the payload part and fix base64 encoding
        let base64Payload = parts[1];
        
        // Replace URL-safe characters
        base64Payload = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if needed
        while (base64Payload.length % 4) {
          base64Payload += '=';
        }

        // Parse JWT payload
        const payload = JSON.parse(atob(base64Payload));
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
