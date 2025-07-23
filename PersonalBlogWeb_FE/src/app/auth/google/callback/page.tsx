"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { Spinner, Typography, Alert } from "@material-tailwind/react";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        console.log("Google callback processing...");
        
        // Get parameters from URL
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const role = searchParams.get('role');
        const authError = searchParams.get('error');

        console.log("Callback params:", { token: !!token, userId, role, error: authError });

        if (authError) {
          const errorMessage = decodeURIComponent(authError);
          console.error("Google auth error:", errorMessage);
          setError(`Authentication failed: ${errorMessage}`);
          setIsProcessing(false);
          return;
        }

        if (token && userId && role) {
          console.log("Logging in user with Google data...");
          
          // Use the login function from AuthContext
          login(token, userId, role);
          
          console.log("Login successful, redirecting to home...");
          
          // Mark as not processing to prevent re-execution
          setIsProcessing(false);
          
          // Small delay to ensure auth state is updated
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Redirect to home page
          router.replace('/home');
        } else {
          console.error("Missing auth data:", { token: !!token, userId, role });
          setError('Authentication failed. Missing required data.');
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Google callback error:', err);
        setError('An unexpected error occurred during authentication.');
        setIsProcessing(false);
      }
    };

    // Only run if we haven't processed yet
    if (isProcessing && !error) {
      handleGoogleCallback();
    }
  }, [searchParams, login, router, isProcessing, error]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Alert color="red" className="mb-4">
            <Typography variant="small">
              {error}
            </Typography>
          </Alert>
          <button
            onClick={() => router.replace('/login')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <Spinner className="h-12 w-12 mx-auto mb-4" />
        <Typography variant="h6" color="blue-gray">
          Processing Google Login...
        </Typography>
        <Typography variant="small" color="gray" className="mt-2">
          Please wait while we complete your authentication.
        </Typography>
      </div>
    </div>
  );
}
