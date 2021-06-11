import Mongoose from 'mongoose';
import {Todo, TodoModel} from './api/todos/todo';
import {User, UserModel} from './api/users/user';
import {DatabaseConfiguration} from './configurations';

export interface Database {
  todoModel: Mongoose.Model<Todo>;
  userModel: Mongoose.Model<User>;
}

export function init(config: DatabaseConfiguration): Database {
  (<any>Mongoose).Promise = Promise;
  Mongoose.connect(process.env.MONGO_URL || config.connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  let mongoDb = Mongoose.connection;

  mongoDb.on('error', () => {
    console.log(`Unable to connect to database: ${config.connectionString}`);
  });

  mongoDb.once('open', () => {
    console.log(`Connected to database: ${config.connectionString}`);
  });

  return {
    todoModel: TodoModel,
    userModel: UserModel,
  };
}
