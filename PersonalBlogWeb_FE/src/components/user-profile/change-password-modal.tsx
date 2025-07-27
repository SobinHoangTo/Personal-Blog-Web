"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Input,
  Button,
  Alert,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon, KeyIcon } from "@heroicons/react/24/outline";
import { changePassword } from "@/lib/api";
import { User } from "@/components/types/auth";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  user,
}: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("All fields are required");
      return false;
    }

    if (formData.newPassword === formData.oldPassword) {
      setError("New password cannot be the same as old password");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      setSuccess("Password changed successfully!");
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswords({ old: false, new: false, confirm: false });
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} handler={handleClose} size="sm">
      <DialogHeader className="flex items-center gap-2">
        <KeyIcon className="h-6 w-6" />
        Change Password
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <DialogBody className="space-y-4">
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

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Username
            </Typography>
            <Input
              type="text"
              value={user.username || ""}
              placeholder="Username"
              disabled
              className="!border-gray-300 focus:!border-gray-900"
              labelProps={{ className: "hidden" }}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Current Password
            </Typography>
            <div className="relative">
              <Input
                type={showPasswords.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
                className="!border-gray-300 focus:!border-gray-900 pr-10"
                labelProps={{ className: "hidden" }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => togglePasswordVisibility("old")}
              >
                {showPasswords.old ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              New Password
            </Typography>
            <div className="relative">
              <Input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="!border-gray-300 focus:!border-gray-900 pr-10"
                labelProps={{ className: "hidden" }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Confirm New Password
            </Typography>
            <div className="relative">
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className="!border-gray-300 focus:!border-gray-900 pr-10"
                labelProps={{ className: "hidden" }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="gray" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" color="blue" disabled={isLoading}>
            {isLoading ? "Changing..." : "Change Password"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
