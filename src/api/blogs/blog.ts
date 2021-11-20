import {Document, ObjectId} from 'mongodb';

export interface Blog extends Document {
  _id?: ObjectId;
  name: string;
  description: string;
  author: string;
  authorId: string;
  created: Date;
  modified: Date;
}

export interface BlogInfo {
  name: string;
  description: string;
  author: string;
  authorId: string;
  created?: Date;
  modified: Date | null;
}

export default function makeBlog(blogInfo: BlogInfo) {
  const blog = normalize(blogInfo);
  return blog;

  function normalize(blog: BlogInfo) {
    return {
      ...blog,
      created: blog.created ? blog.created : new Date(),
      modified: new Date(),
    };
  }
}
