import React, { useState, useEffect } from "react";
import { Button, Input, Select, Option, Typography } from "@material-tailwind/react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getAllCategories, createPost } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";

interface CreatePostFormProps {
  readonly userId: number;
  readonly onPostCreated?: () => void;
}

export default function CreatePostForm({ userId, onPostCreated }: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [coverImage, setCoverImage] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  // Only show form if user is authenticated and viewing their own profile
  if (!user || user.id !== userId) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!title || !content || !categoryId) {
        setError("Please fill all fields.");
        setLoading(false);
        return;
      }
      await createPost({
        title,
        content,
        categoryId: Number(categoryId),
        coverImage: coverImage || undefined,
        status: 0 // pending
      });
      setSuccess("Post created and pending approval.");
      setTitle("");
      setContent("");
      setCategoryId("");
      setCoverImage("");
      if (onPostCreated) onPostCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <form className="bg-white p-8 rounded-lg shadow-lg mb-8" onSubmit={handleSubmit}>
        <Typography variant="h5" className="mb-6 text-center">Create New Post</Typography>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <Typography color="red" className="text-sm">{error}</Typography>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <Typography color="green" className="text-sm">{success}</Typography>
          </div>
        )}

        <div className="mb-6">
          <Input
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            size="lg"
          />
        </div>

        <div className="mb-6">
          <Input
            label="Cover Image URL (optional)"
            value={coverImage}
            onChange={e => setCoverImage(e.target.value)}
            size="lg"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="mb-6">
          <Typography variant="small" color="gray" className="mb-2">
            Content *
          </Typography>
          <CKEditor
            editor={ClassicEditor as any}
            data={content}
            onChange={(_: any, editor: { getData: () => React.SetStateAction<string>; }) => setContent(editor.getData())}
          />
        </div>

        <div className="mb-6">
          <Select
            label="Category"
            value={categoryId}
            onChange={(val) => setCategoryId(val || "")}
            size="lg"
          >
            {categories.map(cat => (
              <Option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </div>

        <div className="flex justify-center">
          <Button 
            type="submit" 
            color="blue" 
            disabled={loading}
            size="lg"
            className="px-8"
          >
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
