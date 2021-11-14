import {MongoClient, Collection} from 'mongodb';
import {DatabaseConfiguration} from './configurations';

export interface Database {
  // blogModel: mongodb.Collection<Blog>;
  userCollection: Collection;
}

export async function init(config: DatabaseConfiguration): Promise<Database> {
  const client = new MongoClient(
    process.env.MONGO_URL || config.connectionString
  );

  await client.connect();

  client.on('error', () => {
    console.log(`Unable to connect to database: ${config.connectionString}`);
  });

  client.once('open', () => {
    console.log(`Connected to database: ${config.connectionString}`);
  });

  const db = client.db(process.env.MONGO_DB || config.db);
  const userCollection = db.collection('users');
  await userCollection.createIndex({username: 1}, {unique: true});

  return {
    userCollection,
  };
}
