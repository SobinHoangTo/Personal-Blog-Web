export interface Comment {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  createdDate: string;
  parentCommentId?: number;
  replies: Comment[];
  likeCount: number;
  isLiked: boolean;
}

export interface CreateCommentRequest {
  postId: number;
  content: string;
  parentCommentId?: number;
}
