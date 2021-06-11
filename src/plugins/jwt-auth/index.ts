import Hapi from '@hapi/hapi';
import {Plugin, PluginOptions} from '../interfaces';
import {Request} from '@/interfaces/request';
import {ServerConfigurations} from '@/configurations';

type ValidateUser = (
  decoded: any,
  request: Request,
  h: Hapi.ResponseToolkit
) => Promise<{isValid: boolean}>;

const register = async (
  server: Hapi.Server,
  options: PluginOptions
): Promise<void> => {
  try {
    const database = options.database;
    const serverConfig = options.serverConfigs;

    const validateUser: ValidateUser = async (
      decoded: any,
      request: Request,
      h: Hapi.ResponseToolkit
    ) => {
      const user = await database.userModel.findById(decoded.id).lean(true);
      if (!user) {
        return {isValid: false};
      }

      return {isValid: true};
    };

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
  {config, validate}: {config: ServerConfigurations; validate: ValidateUser}
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

export default (): Plugin => {
  return {
    register,
    info: () => {
      return {name: 'JWT Authentication', version: '1.0.0'};
    },
  };
};
