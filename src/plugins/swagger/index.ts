import Hapi from '@hapi/hapi';
import {Plugin} from '../interfaces';

const register = async (server: Hapi.Server): Promise<void> => {
  try {
    return server.register([
      require('@hapi/inert'),
      require('@hapi/vision'),
      {
        plugin: require('hapi-swagger'),
        options: {
          info: {
            title: 'Hapi Dev Api',
            description: 'Hapi Dev Api Documentation',
            version: '1.0',
          },
          tags: [
            {
              name: 'blogs',
              description: 'Api blogs interface.',
            },
            {
              name: 'users',
              description: 'Api users interface.',
            },
          ],
          swaggerUI: true,
          documentationPage: true,
          documentationPath: '/documentation',
        },
      },
    ]);
  } catch (err) {
    console.log(`Error registering swagger plugin: ${err}`);
  }
};

export default (): Plugin => {
  return {
    register,
    info: () => {
      return {name: 'Swagger Documentation', version: '1.0.0'};
    },
  };
};
