"use client";

import React from "react";
import { Alert } from "@material-tailwind/react";

interface UserProfileErrorProps {
  readonly error: string;
}

export default function UserProfileError({ error }: UserProfileErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Alert color="red" className="max-w-md">
        {error}
      </Alert>
    </div>
  );
}
