import nconf from 'nconf';
import path from 'path';

const configs = nconf
  .argv()
  .env()
  .file({
    file: path.join(__dirname, `/config.${process.env.NODE_ENV || 'dev'}.json`),
  });

export interface ServerConfigurations {
  port: number;
}

export interface DatabaseConfiguration {
  connectionString: string;
}

export function getDatabaseConfig(): DatabaseConfiguration {
  return configs.get('database');
}

export function getServerConfig(): ServerConfigurations {
  return configs.get('server');
}
