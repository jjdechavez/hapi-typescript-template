import Mongoose, {PopulatedDoc} from 'mongoose';
import {User} from '../users/user';

export interface Todo extends Mongoose.Document {
  user: PopulatedDoc<User & Mongoose.Document>;
  name: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const TodoSchema = new Mongoose.Schema<Todo>(
  {
    user: {type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true},
    description: String,
    completed: {type: Boolean, default: false},
  },
  {timestamps: true}
);

export const TodoModel = Mongoose.model<Todo>('Todo', TodoSchema);
