import Hapi from '@hapi/hapi';
import {PluginOptions} from '../interfaces';
import {Request} from '@/interfaces/request';
import {ServerConfigurations} from '@/configurations';

const register = async (
  server: Hapi.Server,
  options: PluginOptions
): Promise<void> => {
  try {
    const database = options.database;
    const serverConfig = options.serverConfigs;

    const validateUser = async (
      decoded: any,
      request: Request,
      h: Hapi.ResponseToolkit
    ) => {};

    await server.register(require('hapi-auth-jwt2'));

    return setAuthStrategy(server, {
      config: serverConfig,
      validate: validateUser,
    });
  } catch (error) {
    console.error(`Error registering jwt plugin: ${error}`);
    throw error;
  }
};

const setAuthStrategy = async (
  server: Hapi.Server,
  {
    config,
    validate,
  }: {config: ServerConfigurations; validate: Promise<{isValid: boolean}>}
) => {
  server.auth.strategy('jwt', 'jwt', {
    key: config.jwtSecret,
    validate,
    verifyOptions: {
      algorithms: ['HS256'],
    },
  });

  server.auth.default('jwt');

  return;
};
