import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Dialog, DialogBody, DialogFooter, DialogHeader, Select, Option, Alert } from "@material-tailwind/react";
import CKEditorClient from "@/components/common/CKEditorClient";
import { updatePost, getAllCategories } from "@/lib/api";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface EditPostModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly post: any;
  readonly onPostUpdated: (updatedPost: any) => void;
}

export default function EditPostModal({ isOpen, onClose, post, onPostUpdated }: EditPostModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: 1,
    coverImage: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApprovalAlert, setShowApprovalAlert] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        content: post.content || "",
        categoryId: post.categoryId || 1,
        coverImage: post.coverImage || "",
      });
    }
  }, [post]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await getAllCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!post?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Updating post', post.id, formData);
      const updatedPost = await updatePost(post.id, {
        ...formData,
        categoryId: formData.categoryId ?? 1,
      });
      
      // Show approval alert for 3 seconds then close modal
      setShowApprovalAlert(true);
      setTimeout(() => {
        setShowApprovalAlert(false);
        onPostUpdated(updatedPost);
        onClose();
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Approval Alert - Fixed position overlay */}
      {showApprovalAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <Alert
            color="green"
            icon={<CheckCircleIcon className="h-6 w-6" />}
            className="max-w-md shadow-xl border border-green-200"
            animate={{
              mount: { scale: 1, opacity: 1 },
              unmount: { scale: 0.9, opacity: 0 },
            }}
          >
            <Typography variant="h6" color="white" className="font-medium">
              Post Updated Successfully!
            </Typography>
            <Typography variant="small" color="white" className="mt-1 opacity-90">
              Wait for Admin to approve your post before changes appear publicly.
            </Typography>
          </Alert>
        </div>
      )}
      
      <Dialog 
        open={isOpen} 
        handler={onClose} 
        size="xl"
        className="max-h-[90vh] overflow-y-auto"
      >
      <DialogHeader
      >
        Edit Post
      </DialogHeader>
      <DialogBody
        className="max-h-[70vh] overflow-y-auto"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <Typography color="red" className="text-sm">{error}</Typography>
          </div>
        )}
        
        <div className="space-y-4">
          <Input
            label="Post Title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter post title"
            required
          />
          
          <Input
            label="Cover Image URL"
            value={formData.coverImage}
            onChange={(e) => handleInputChange("coverImage", e.target.value)}
            placeholder="Enter cover image URL (optional)"
          />
          
          <div className="w-full">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Category
            </Typography>
            <Select
              value={(formData.categoryId ?? 1).toString()}
              onChange={(value) => handleInputChange("categoryId", parseInt(value || "1"))}
            >
              {categories.filter(category => category?.id != null).map((category) => (
                <Option key={category.id} value={category.id.toString()}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </div>
          
          <div className="w-full">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Content
            </Typography>
            <div className="border border-gray-300 rounded-lg">
              <CKEditorClient
                data={formData.content}
                onChange={(event: any, editor: any) => {
                  const data = editor.getData();
                  handleInputChange("content", data);
                }}
                config={{
                  toolbar: [
                    'heading', '|',
                    'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                    'outdent', 'indent', '|',
                    'blockQuote', 'insertTable', '|',
                    'undo', 'redo'
                  ],
                  placeholder: "Write your post content here..."
                }}
              />
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter
      >
        <Button variant="text" color="gray" onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button color="blue" onClick={handleSubmit} loading={loading}>
          Update Post
        </Button>
      </DialogFooter>
    </Dialog>
    </>
  );
}
