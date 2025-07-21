// types/post.ts
export type Post = {
  id: number;
  title: string;
  content?: string;
  date: string;
  categoryName?: string;
  likeCount: number;
  commentCount: number;
  author: {
    authorID: number;
    authorName: string;
    authorAvatar: string;
  };
};

export type BlogPostCardProps = {
  img: string;
  tag: string;
  title: string;
  desc: string;
  author: {
    name: string;
    img: string;
  };
  date: string;
  likeCount?: number;
  commentCount?: number;
};
