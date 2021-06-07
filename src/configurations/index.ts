import nconf from 'nconf';
import path from 'path';

const configs = new nconf.Provider({
  env: true,
  argv: true,
  store: {
    type: 'file',
    file: path.join(
      __dirname,
      `./config.${process.env.NODE_ENV || 'dev'}.json`
    ),
  },
});

export function getDatabaseConfig() {
  return configs.get('database');
}

export function getServerConfig() {
  return configs.get('server');
}
