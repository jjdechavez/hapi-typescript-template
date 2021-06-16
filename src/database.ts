import Mongoose from 'mongoose';
import {Blog, BlogModel} from './api/blogs/blog';
import {User, UserModel} from './api/users/user';
import {DatabaseConfiguration} from './configurations';

export interface Database {
  blogModel: Mongoose.Model<Blog>;
  userModel: Mongoose.Model<User>;
}

export function init(config: DatabaseConfiguration): Database {
  (<any>Mongoose).Promise = Promise;
  Mongoose.connect(process.env.MONGO_URL || config.connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });

  let mongoDb = Mongoose.connection;

  mongoDb.on('error', () => {
    console.log(`Unable to connect to database: ${config.connectionString}`);
  });

  mongoDb.once('open', () => {
    console.log(`Connected to database: ${config.connectionString}`);
  });

  return {
    blogModel: BlogModel,
    userModel: UserModel,
  };
}
