import Hapi from '@hapi/hapi';
import {ServerConfigurations} from './configurations';

export async function init(
  configs: ServerConfigurations
): Promise<Hapi.Server> {
  try {
    const PORT = process.env.PORT || configs.port;
    const server = new Hapi.Server({
      debug: {request: ['error']},
      port: PORT,
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });

    return server;
  } catch (error) {
    console.log('Error starting server: ', error);
    throw error;
  }
}
