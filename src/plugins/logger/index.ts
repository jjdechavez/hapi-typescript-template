import Hapi from '@hapi/hapi';
import {Plugin} from '../interfaces';

const register = async (server: Hapi.Server): Promise<void> => {
  try {
    return server.register({
      plugin: require('hapi-pino'),

      options: {
        prettyPrint: process.env.NODE_ENV !== 'production',
        // Redact Authorization headers, see https://getpino.io/#/docs/redaction
        redact: ['req.headers.authorization'],
      },
    });
  } catch (error) {
    console.log(`Error registering logger plugin: ${error}`);
    throw error;
  }
};

export default (): Plugin => {
  return {
    register,
    info: () => {
      return {name: 'Hapi Pino', version: '1.0.0'};
    },
  };
};
