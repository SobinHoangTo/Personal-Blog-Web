import React, { useState } from "react";
import { Button, Input, Textarea, Typography, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { updateUserProfile } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";

interface EditProfileModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onProfileUpdated: (updatedUser: any) => void;
  readonly user: any; // Accept user prop for prefill
}

export default function EditProfileModal({ isOpen, onClose, onProfileUpdated, user }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form fields when user changes (e.g., modal opened with new user data)
  React.useEffect(() => {
    setFormData({
      fullName: user?.fullName || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
    });
  }, [user, isOpen]);

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await updateUserProfile(formData);
      onProfileUpdated(updatedUser);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog 
      open={isOpen} 
      handler={onClose} 
      size="md"
    >
      <DialogHeader
      >
        Edit Profile
      </DialogHeader>
      <DialogBody
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <Typography color="red" className="text-sm">{error}</Typography>
          </div>
        )}
        
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter your full name"
          />
          
          <Input
            label="Avatar URL"
            value={formData.avatar}
            onChange={(e) => handleInputChange("avatar", e.target.value)}
            placeholder="Enter avatar image URL"
          />
          
          <Textarea
            label="Bio"
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>
      </DialogBody>
      <DialogFooter
      >
        <Button variant="text" color="gray" onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button color="blue" onClick={handleSubmit} loading={loading}>
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
