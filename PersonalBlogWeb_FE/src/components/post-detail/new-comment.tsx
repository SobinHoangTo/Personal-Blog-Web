"use client";

import Image from "next/image";
import { Button, Typography, Textarea } from "@material-tailwind/react";
import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { createCommentAuth } from "@/lib/api";
import { Comment } from "@/components/types/comment";

interface NewCommentProps {
  readonly postId: number;
  readonly onCommentAdded: (comment: Comment) => void;
}

export function NewComment({ postId, onCommentAdded }: NewCommentProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    try {
      setLoading(true);
      const newComment = await createCommentAuth(postId, content);
      
      // Create a comment object to update the UI
      const commentForUI: Comment = {
        id: newComment.id,
        content,
        authorId: user?.id || 0,
        authorName: user?.username || "Unknown",
        authorAvatar: user?.avatar || `/image/avatar${(user?.id || 1) % 3 + 1}.jpg`,
        createdDate: new Date().toISOString(),
        parentCommentId: undefined,
        replies: [],
        likeCount: 0,
        isLiked: false
      };
      
      onCommentAdded(commentForUI);
      setContent("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex !items-center gap-4">
        <div className=" !m-0 h-full  w-full  max-h-[40px] max-w-[40px] ">
          <Image
            width={768}
            height={768}
            src={user?.avatar || `/image/avatar${(user?.id || 1) % 3 + 1}.jpg`}
            alt="user avatar"
            className="h-full rounded w-full object-cover object-center"
          />
        </div>
        <Typography
          variant="small"
          className=" font-bold flex items-center gap-2 !text-gray-900"
        >
          {user?.fullName || "User"}
        </Typography>
      </div>
      <div className="flex-col mt-4 pl-14 h-full">
        <form onSubmit={handleSubmit} className="flex flex-col items-end">
          <Textarea
            label="Your Comment"
            variant="static"
            placeholder="Write a nice comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          <Button 
            type="submit"
            color="gray" 
            className="mt-4" 
            size="md"
            disabled={loading || !content.trim()}
          >
            {loading ? "Posting..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}
