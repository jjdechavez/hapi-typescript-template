import dotenv from 'dotenv';

dotenv.config();

export interface ServerConfigurations {
  port: number;
}

export interface DatabaseConfiguration {
  connectionString: string;
}

export function getDatabaseConfig(): DatabaseConfiguration {
  let mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.dev'
    );
  }

  return {
    connectionString: mongoURI,
  };
}

export function getServerConfig(): ServerConfigurations {
  let PORT = process.env.PORT || 5000;
  if (!PORT) {
    throw new Error(
      'Please define the PORT environment variable inside .env.dev'
    );
  }

  return {
    port: +PORT,
  };
}
