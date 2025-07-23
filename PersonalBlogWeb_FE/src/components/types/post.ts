// types/post.ts
// export type Post = {
//   id: number;
//   title: string;
//   content: string;
//   coverImage?: string;
//   createdDate: string;
//   categoryName: string;
//   likeCount: number;
//   commentCount: number;
//   author: {
//     authorID: number;
//     authorName: string;
//     authorAvatar: string;
//   };
// };

export type Post = {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  createdDate: string;
  categoryName: string;
  authorName: string;
  authorAvatar: string;
  likeCount: number;
  commentCount: number;
};

export type BlogPostCardProps = {
  id: number;
  coverImage: string;
  categoryName: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdDate: string;
  likeCount?: number;
  commentCount?: number;
};

export type PostDetailProps = {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  createdDate: string;
  categoryName: string;
  likeCount: number;
  commentCount: number;
  author: {
    authorID: number;
    authorName: string;
    authorAvatar: string;
  };
  comments: {
    id: number;
    content: string;
    author: {
      authorID: number;
      authorName: string;
      authorAvatar: string;
    };
  }[];
};
