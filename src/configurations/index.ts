import dotenv from 'dotenv';

dotenv.config();

export interface ServerConfigurations {
  port: number;
  host: string;
  routePrefix: string;
  jwtSecret: string;
  jwtExpiration: string;
  plugins: string[];
}

export interface DatabaseConfiguration {
  connectionString: string;
  db: string;
}

export function getDatabaseConfig(): DatabaseConfiguration {
  let mongoURI = process.env.MONGO_URI;
  let mongoDB = process.env.MONGO_DB;
  if (!mongoURI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.dev'
    );
  }

  if (!mongoDB) {
    throw new Error(
      'Please define the MONGODB_DB environment variable inside .env.dev'
    );
  }

  return {
    connectionString: mongoURI,
    db: mongoDB,
  };
}

export function getServerConfig(): ServerConfigurations {
  const {PORT, HOST, jwtSecret, jwtExpiration} = process.env;
  let port = PORT || 5000;
  let route = '';
  const plugins = ['logger', 'jwt-auth', 'swagger'];

  if (!HOST) {
    throw new Error(
      'Please define the HOST environment variable inside .env.dev'
    );
  }

  if (!jwtSecret) {
    throw new Error(
      'Please define the jwtSecret environment variable inside .env.dev'
    );
  }

  if (!jwtExpiration) {
    throw new Error(
      'Please define the jwtExpiration environment variable inside .env.dev'
    );
  }

  return {
    port: +port,
    host: HOST,
    routePrefix: route,
    jwtSecret,
    jwtExpiration,
    plugins,
  };
}
