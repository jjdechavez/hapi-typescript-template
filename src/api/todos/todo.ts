import Mongoose from 'mongoose';

export interface Todo extends Mongoose.Document {
  userId: string;
  name: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const TodoSchema = new Mongoose.Schema(
  {
    userId: {type: String, required: true},
    name: {type: String, required: true},
    description: String,
    completed: {type: Boolean, default: false},
  },
  {timestamps: true}
);

export const TodoModel = Mongoose.model<Todo>('Todo', TodoSchema);
