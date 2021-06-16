import Mongoose, {PopulatedDoc} from 'mongoose';
import {User} from '../users/user';

export interface Blog extends Mongoose.Document {
  user: PopulatedDoc<User & Mongoose.Document>;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const BlogSchema = new Mongoose.Schema<Blog>(
  {
    user: {type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true},
    description: String,
  },
  {timestamps: true}
);

export const BlogModel = Mongoose.model<Blog>('Blog', BlogSchema);
