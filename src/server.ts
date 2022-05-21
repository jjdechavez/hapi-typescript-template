import Hapi from '@hapi/hapi';
import {ServerConfigurations} from './configurations';
import {Database} from './database';
import * as Blogs from './api/blogs';
import * as Users from './api/users';

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
          credentials: true,
        },
      },
    });

    if (configs.routePrefix) {
      server.realm.modifiers.route.prefix = configs.routePrefix;
    }

    const plugins = configs.plugins;
    const pluginOptions = {
      database: database,
      serverConfigs: configs,
    };

    let pluginPromises: Promise<any>[] = [];

    plugins.forEach((pluginName: string) => {
      let plugin = require('./plugins/' + pluginName).default();
      console.log(
        `Register Plugin ${plugin.info().name} v${plugin.info().version}`
      );
      pluginPromises.push(plugin.register(server, pluginOptions));
    });

    await Promise.all(pluginPromises);

    server.route({
      method: 'GET',
      path: '/',
      handler: function (request) {
        // you can also use a pino instance, which will be faster
        request.logger.info('In handler %s', request.path);
        return 'Hello World';
      },
    });

    // and through Hapi standard logging system
    // server.log(['subsystem'], 'third way for accessing it');
    console.log('Register Routes');
    Blogs.init(server, configs, database);
    Users.init(server, configs, database);
    console.log('Routes registered sucessfully.');

    return server;
  } catch (error) {
    console.log('Error starting server: ', error);
    throw error;
  }
}
