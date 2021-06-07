import * as Server from './server';
import * as Configs from './configurations';

console.log(`Running environment ${process.env.NODE_ENV || 'dev'}`);

// Catch unhandling unexpected exceptions
process.on('uncaughtException', (error: Error) => {
  console.error(`uncaughtException ${error.message}`);
});

// Catch unhandling rejected promises
process.on('unhandledRejection', (reason: any) => {
  console.error(`unhandledRejection ${reason}`);
});

export interface App {
  config: Configs.ServerConfigurations;
}

const start = async ({config}: App) => {
  const server = await Server.init(config);
  console.log('Server running on %s', server.info.uri);
};

// Init Server config
const serverConfigs = Configs.getServerConfig();

start({config: serverConfigs});
