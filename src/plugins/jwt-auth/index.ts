import {ObjectId} from 'mongodb';
import Hapi from '@hapi/hapi';
import {Plugin, PluginOptions} from '../interfaces';
import {AuthRequest} from '@/interfaces/request';
import {ServerConfigurations} from '@/configurations';

type ValidateUser = (
  decoded: any,
  request: AuthRequest,
  h: Hapi.ResponseToolkit
) => Promise<{isValid: boolean}>;

interface AuthStrategyOptions {
  config: ServerConfigurations;
  validate: ValidateUser;
}

const register = async (
  server: Hapi.Server,
  options: PluginOptions
): Promise<void> => {
  try {
    const database = options.database;
    const serverConfig = options.serverConfigs;

    const validateUser: ValidateUser = async (decoded: any) => {
      const user = await database.userCollection.findOne({
        _id: new ObjectId(decoded.id),
      });

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
  {config, validate}: AuthStrategyOptions
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
