import dotenv from 'dotenv';

dotenv.config();

export interface ServerConfigurations {
  port: number;
  host: string;
  routePrefix: string;
  plugins: string[];
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
  const {PORT, HOST} = process.env;
  let port = PORT || 5000;
  let route = '';
  const plugins = ['logger'];

  if (!HOST) {
    throw new Error(
      'Please define the HOST environment variable inside .env.dev'
    );
  }

  return {
    port: +port,
    host: HOST,
    routePrefix: route,
    plugins,
  };
}