// post-detail/comments.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Typography, Spinner } from "@material-tailwind/react";
import { NewComment } from "@/components/post-detail/new-comment";
import CommentCard from "@/components/post-detail/comment-card";
import { Comment } from "@/components/types/comment";
import { getPostComments } from "@/lib/api";

interface CommentsProps {
  readonly postId: number;
}

export function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await getPostComments(postId);
        
        // Transform API data to match our Comment interface
        const transformedComments: Comment[] = data.map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          authorName: comment.authorName,
          authorAvatar: comment.authorAvatar,
          createdDate: comment.createdDate,
          parentCommentId: comment.parentCommentId,
          replies: comment.replies?.map((reply: any) => ({
            ...reply,
            authorId: reply.authorId,
            authorName: reply.authorName,
            createdDate: reply.createdDate,
            authorAvatar: reply.authorAvatar,
            likeCount: 0,
            isLiked: false
          })) || [],
          likeCount: 0, // Will be fetched separately if needed
          isLiked: false
        }));
        
        setComments(transformedComments);
      } catch (err) {
        setError("Failed to load comments");
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // Helper functions
  const formatCommentDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return " · just now";
    if (diffMins < 60) return ` · ${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return ` · ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return ` · ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return ` · ${date.toLocaleDateString()}`;
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleCommentLike = (commentId: number) => {
    // TODO: Implement like functionality with API
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1
        };
      }
      // Check replies
      return {
        ...comment,
        replies: comment.replies.map(reply => 
          reply.id === commentId 
            ? {
                ...reply,
                isLiked: !reply.isLiked,
                likeCount: reply.isLiked ? reply.likeCount - 1 : reply.likeCount + 1
              }
            : reply
        )
      };
    }));
  };

  const handleCommentReply = (commentId: number) => {
    // TODO: Implement reply functionality
    console.log("Reply to comment:", commentId);
  };

  if (loading) {
    return (
      <section className="w-full max-w-2xl mx-auto flex flex-col px-5 pb-20">
        <div className="flex justify-center items-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-2xl mx-auto flex flex-col px-5 pb-20">
        <Typography variant="h6" color="red" className="text-center py-12">
          {error}
        </Typography>
      </section>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto flex flex-col px-5 pb-20">
      <Typography
        variant="h4"
        className="my-6 md:my-14 md:text-center"
        color="blue-gray"
      >
        Post Your Comment
      </Typography>
      
      <div className="mb-8">
        {/* NewComment component - will need to be updated to accept props */}
        <NewComment />
      </div>
      
      <Typography variant="h4" className="mt-12 md:text-center" color="blue-gray">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </Typography>
      
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <Typography variant="paragraph" color="gray">
            No comments yet. Be the first to comment!
          </Typography>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentCard
                img={comment.authorAvatar || "/image/avatar1.jpg"}
                name={comment.authorName}
                hours={formatCommentDate(comment.createdDate)}
                desc={comment.content}
              />
              
              {/* Render replies */}
              {comment.replies.length > 0 && (
                <div className="md:pl-14 mt-4 space-y-4">
                  {comment.replies.map((reply) => (
                    <CommentCard
                      key={reply.id}
                      img={reply.authorAvatar || "/image/avatar1.jpg"}
                      name={reply.authorName}
                      hours={formatCommentDate(reply.createdDate)}
                      desc={reply.content}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Comments;
