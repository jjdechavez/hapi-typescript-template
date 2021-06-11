import Hapi from '@hapi/hapi';
import UserController from './user-controller';
// import * as TodoValidator from './todo-validator';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';

export default function (
  server: Hapi.Server,
  configs: ServerConfigurations,
  database: Database
) {
  const userController = new UserController(configs, database);
  server.bind(userController);

  server.route({
    method: 'POST',
    path: '/todos',
    options: {
      handler: userController.createTodo,
      tags: ['api', 'todo'],
      description: 'Create a todo.',
      validate: {
        options: {
          abortEarly: false,
        },
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });
}
