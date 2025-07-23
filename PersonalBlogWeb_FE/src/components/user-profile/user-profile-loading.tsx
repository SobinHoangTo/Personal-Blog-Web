"use client";

import React from "react";
import { Spinner } from "@material-tailwind/react";

export default function UserProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Spinner className="h-12 w-12" />
    </div>
  );
}
