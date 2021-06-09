import Mongoose from 'mongoose';

export interface Todo extends Mongoose.Document {
  name: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const TodoSchema = new Mongoose.Schema(
  {
    name: {type: String, required: true},
    description: String,
    completed: String,
  },
  {timestamps: true}
);

export const TodoModel = Mongoose.model<Todo>('Todo', TodoSchema);
