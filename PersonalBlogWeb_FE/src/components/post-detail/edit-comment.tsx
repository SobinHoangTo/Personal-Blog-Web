"use client";

import { Button, Textarea } from "@material-tailwind/react";
import { useState } from "react";
import { updateComment } from "@/lib/api";

interface EditCommentProps {
  readonly commentId: number;
  readonly currentContent: string;
  readonly onSave: (newContent: string) => void;
  readonly onCancel: () => void;
}

export function EditComment({ commentId, currentContent, onSave, onCancel }: EditCommentProps) {
  const [content, setContent] = useState(currentContent);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    try {
      setLoading(true);
      await updateComment(commentId, content);
      onSave(content);
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit} className="flex flex-col items-end">
        <Textarea
          label="Edit Comment"
          variant="static"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          size="md"
        />
        <div className="flex gap-2 mt-4">
          <Button 
            type="button"
            variant="text"
            color="gray" 
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            color="blue" 
            size="sm"
            disabled={loading || !content.trim() || content === currentContent}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditComment;
