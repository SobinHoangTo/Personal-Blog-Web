import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Dialog, DialogBody, DialogFooter, DialogHeader, Select, Option } from "@material-tailwind/react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { updatePost, getAllCategories } from "@/lib/api";

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
      onPostUpdated(updatedPost);
      onClose();
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
              {categories.filter(category => category && category.id != null).map((category) => (
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
              <CKEditor
                editor={ClassicEditor as any}
                data={formData.content}
                onChange={(event, editor) => {
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
  );
}
