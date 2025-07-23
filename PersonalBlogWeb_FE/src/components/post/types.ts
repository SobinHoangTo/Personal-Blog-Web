export type Category = {
  id: number;
  name: string;
};

export type Post = {
  id: number;
  title: string;
  desc: string;
  date: string;
  img: string;
  author: {
    name: string;
    img: string;
  };
};
