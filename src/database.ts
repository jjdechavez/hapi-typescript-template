import Mongoose from 'mongoose';
import {DatabaseConfiguration} from './configurations';

export function init(config: DatabaseConfiguration) {
  (<any>Mongoose).Promise = Promise;
  Mongoose.connect(process.env.MONGO_URL || config.connectionString, {
    useUnifiedTopology: true,
  });

  let mongoDb = Mongoose.connection;

  mongoDb.on('error', () => {
    console.log(`Unable to connect to database: ${config.connectionString}`);
  });

  mongoDb.once('open', () => {
    console.log(`Connected to database: ${config.connectionString}`);
  });
}
