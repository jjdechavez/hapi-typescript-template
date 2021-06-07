import {Server, Request, ResponseToolkit} from '@hapi/hapi';

const init = async () => {
  const server: Server = new Server({
    port: 5000,
    host: 'localhost',
  });
  server.route({
    method: 'GET',
    path: '/',
    handler: (request: Request, h: ResponseToolkit) => {
      return 'Hello World!';
    },
  });
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log('unhandledRejection ', err);
});

init();
