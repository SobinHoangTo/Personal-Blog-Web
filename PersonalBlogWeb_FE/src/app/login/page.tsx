"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
  Button,
  Alert,
  Spinner
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { loginUser } from "@/lib/api";
import { LoginResponse } from "@/components/types/auth";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/auth/google-login-button";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response: LoginResponse = await loginUser(formData.username, formData.password);
      
      // Store authentication data using auth context
      login(response.accessToken, response.userId, response.role);
      
      setSuccess("Login successful! Redirecting...");
      
      // Redirect to home page after successful login
      setTimeout(() => {
        router.push("/");
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="mt-6 w-full">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          
          <CardBody className="flex flex-col gap-4">
            {error && (
              <Alert color="red" className="mb-4">
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert color="green" className="mb-4">
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Username
                </Typography>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Password
                </Typography>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900 pr-10"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-6"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <Typography variant="small" color="gray">or</Typography>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Login Button */}
            <div className="mt-4">
              <GoogleLoginButton fullWidth disabled={loading} />
            </div>

            <Typography color="gray" className="mt-4 text-center font-normal">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-blue-500 hover:underline">
                Sign Up
              </Link>
            </Typography>

            <Typography color="gray" className="mt-2 text-center font-normal">
              <Link href="/forgot-password" className="font-medium text-blue-500 hover:underline">
                Forgot your password?
              </Link>
            </Typography>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
