import Hapi from '@hapi/hapi';
import {ServerConfigurations} from './configurations';
import {Database} from './database';

export async function init(
  configs: ServerConfigurations,
  database: Database
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

    if (configs.routePrefix) {
      server.realm.modifiers.route.prefix = configs.routePrefix;
    }

    const pluginOptions = {
      database: database,
      serverConfigs: configs,
    };

    let pluginPromises: Promise<any>[] = [];

    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, h) {
        // you can also use a pino instance, which will be faster
        request.logger.info('In handler %s', request.path);
        return 'Hello World';
      },
    });

    await server.register({
      plugin: require('hapi-pino'),
      options: {
        prettyPrint: process.env.NODE_ENV !== 'production',
        // Redact Authorization headers, see https://getpino.io/#/docs/redaction
        redact: ['req.headers.authorization'],
      },
    });

    // and through Hapi standard logging system
    server.log(['subsystem'], 'third way for accessing it');

    return server;
  } catch (error) {
    console.log('Error starting server: ', error);
    throw error;
  }
}
