// post-detail/comments.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Typography, Spinner, Alert, Button } from "@material-tailwind/react";
import { NewComment } from "@/components/post-detail/new-comment";
import CommentCard from "@/components/post-detail/comment-card";
import ReplyComment from "@/components/post-detail/reply-comment";
import EditComment from "@/components/post-detail/edit-comment";
import { Comment } from "@/components/types/comment";
import { getPostComments, likeComment, deleteComment } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import Link from "next/link";

interface CommentsProps {
  readonly postId: number;
}

export function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const { isAuthenticated, user } = useAuth();

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
            authorAvatar: reply.authorAvatar,
            likeCount: reply.likeCount || 0,
            isLiked: reply.isLiked || false
          })) || [],
          likeCount: comment.likeCount || 0,
          isLiked: comment.isLiked || false
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

  const handleCommentLike = async (commentId: number) => {
    if (!isAuthenticated) {
      alert("Please login to like comments");
      return;
    }

    console.log("HandleCommentLike called for comment:", commentId);
    console.log("User authenticated:", isAuthenticated);
    console.log("Current user:", user);

    try {
      const result = await likeComment(commentId);
      console.log("Like API result:", result);
      const newIsLiked = result.message === "Liked";
      console.log("New isLiked state:", newIsLiked);
      
      // Update the comment like status based on server response
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          console.log("Updating main comment:", comment.id);
          return {
            ...comment,
            isLiked: newIsLiked,
            likeCount: newIsLiked ? comment.likeCount + 1 : comment.likeCount - 1
          };
        }
        // Check replies
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId 
              ? {
                  ...reply,
                  isLiked: newIsLiked,
                  likeCount: newIsLiked ? reply.likeCount + 1 : reply.likeCount - 1
                }
              : reply
          )
        };
      }));
    } catch (error) {
      console.error("Error liking comment:", error);
      alert("Failed to like comment. Please try again.");
    }
  };

  const handleCommentReply = (commentId: number) => {
    setReplyingTo(commentId);
    setEditingComment(null); // Close edit mode if open
  };

  const handleReplyAdded = (parentCommentId: number, newReply: Comment) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return comment;
    }));
    setReplyingTo(null);
  };

  const handleEditComment = (commentId: number) => {
    setEditingComment(commentId);
    setReplyingTo(null); // Close reply mode if open
  };

  const handleEditSave = (commentId: number, newContent: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content: newContent };
      }
      // Check replies
      return {
        ...comment,
        replies: comment.replies.map(reply => 
          reply.id === commentId 
            ? { ...reply, content: newContent }
            : reply
        )
      };
    }));
    setEditingComment(null);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          // Delete main comment by filtering it out
          return null;
        }
        // Delete reply
        return {
          ...comment,
          replies: comment.replies.filter(reply => reply.id !== commentId)
        };
      }).filter(Boolean) as Comment[]);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
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
        Leave Your Comment
      </Typography>
      
      <div className="mb-8">
        {isAuthenticated ? (
          <NewComment postId={postId} onCommentAdded={handleCommentAdded} />
        ) : (
          <Alert color="blue" className="mb-4">
            <div className="flex items-center justify-between">
              <Typography variant="paragraph" color="blue-gray">
                Please login to post comments
              </Typography>
              <div className="flex gap-2">
                <Link href="/login">
                  <Button size="sm" variant="text">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" color="blue">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </Alert>
        )}
      </div>
      
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <Typography variant="paragraph" color="gray">
            No comments yet. Be the first to comment!
          </Typography>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6">
          {comments.map((comment) => (
            <div key={`comment-${comment.id}`}>
              {editingComment === comment.id ? (
                <EditComment
                  commentId={comment.id}
                  currentContent={comment.content}
                  onSave={(newContent) => handleEditSave(comment.id, newContent)}
                  onCancel={() => setEditingComment(null)}
                />
              ) : (
                <CommentCard
                  img={comment.authorAvatar || "/image/avatar1.jpg"}
                  name={comment.authorName}
                  hours={formatCommentDate(comment.createdDate)}
                  desc={comment.content}
                  likeCount={comment.likeCount}
                  isLiked={comment.isLiked}
                  onLike={() => handleCommentLike(comment.id)}
                  onReply={() => handleCommentReply(comment.id)}
                  onEdit={() => handleEditComment(comment.id)}
                  onDelete={() => handleDeleteComment(comment.id)}
                  authorId={comment.authorId}
                  commentId={comment.id}
                />
              )}
              
              {/* Reply form */}
              {replyingTo === comment.id && (
                <ReplyComment
                  postId={postId}
                  parentCommentId={comment.id}
                  onReplyAdded={(reply) => handleReplyAdded(comment.id, reply)}
                  onCancel={() => setReplyingTo(null)}
                />
              )}
              
              {/* Render replies */}
              {comment.replies.length > 0 && (
                <div className="md:pl-14 mt-4 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={`reply-${reply.id}`}>
                      {editingComment === reply.id ? (
                        <EditComment
                          commentId={reply.id}
                          currentContent={reply.content}
                          onSave={(newContent) => handleEditSave(reply.id, newContent)}
                          onCancel={() => setEditingComment(null)}
                        />
                      ) : (
                        <CommentCard
                          img={reply.authorAvatar || "/image/avatar1.jpg"}
                          name={reply.authorName}
                          hours={formatCommentDate(reply.createdDate)}
                          desc={reply.content}
                          likeCount={reply.likeCount}
                          isLiked={reply.isLiked}
                          onLike={() => handleCommentLike(reply.id)}
                          onReply={() => handleCommentReply(comment.id)} // Reply to the main comment, not the reply
                          onEdit={() => handleEditComment(reply.id)}
                          onDelete={() => handleDeleteComment(reply.id)}
                          isReply={true}
                          authorId={reply.authorId}
                          commentId={reply.id}
                        />
                      )}
                    </div>
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
