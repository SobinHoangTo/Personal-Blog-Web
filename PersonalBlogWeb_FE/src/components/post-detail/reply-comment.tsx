"use client";

import Image from "next/image";
import { Button, Typography, Textarea } from "@material-tailwind/react";
import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { createCommentAuth } from "@/lib/api";
import { Comment } from "@/components/types/comment";

interface ReplyCommentProps {
  readonly postId: number;
  readonly parentCommentId: number;
  readonly onReplyAdded: (reply: Comment) => void;
  readonly onCancel: () => void;
}

export function ReplyComment({ postId, parentCommentId, onReplyAdded, onCancel }: ReplyCommentProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    try {
      setLoading(true);
      const newReply = await createCommentAuth(postId, content, parentCommentId);
      
      // Create a reply object to update the UI
      const replyForUI: Comment = {
        id: newReply.id,
        content,
        authorId: user?.id || 0,
        authorName: user?.username || "Unknown",
        authorAvatar: user?.avatar || `/image/avatar${(user?.id || 1) % 3 + 1}.jpg`,
        createdDate: new Date().toISOString(),
        parentCommentId,
        replies: [],
        likeCount: 0,
        isLiked: false
      };
      
      onReplyAdded(replyForUI);
      setContent("");
      onCancel(); // Close the reply form after successful submission
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Failed to post reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 ml-14 p-4 bg-gray-50 rounded-lg">
      <div className="flex !items-center gap-4 mb-4">
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
      
      <form onSubmit={handleSubmit} className="flex flex-col items-end">
        <Textarea
          label="Your Reply"
          variant="static"
          placeholder="Write your reply..."
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
            disabled={loading || !content.trim()}
          >
            {loading ? "Posting..." : "Reply"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ReplyComment;
