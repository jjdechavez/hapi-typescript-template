import mongodb from 'mongodb';
// import {Blog, BlogModel} from './api/blogs/blog';
import {User} from './api/users/user';
import {DatabaseConfiguration} from './configurations';

export interface Database {
  // blogModel: mongodb.Collection<Blog>;
  userCollection: mongodb.Collection<User>;
}

export async function init(config: DatabaseConfiguration): Promise<Database> {
  const MongoClient = mongodb.MongoClient;
  const client = new MongoClient(
    process.env.MONGO_URL || config.connectionString
  );

  await client.connect();

  const db = client.db(process.env.MONGO_DB || config.db);

  client.on('error', () => {
    console.log(`Unable to connect to database: ${config.connectionString}`);
  });

  client.once('open', () => {
    console.log(`Connected to database: ${config.connectionString}`);
  });

  const userCollection = db.collection<User>('User');

  return {
    // blogModel: BlogModel,
    userCollection,
  };
}
