import Hapi from '@hapi/hapi';
import TodoController from './todo-controller';
import * as TodoValidator from './todo-validator';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';

export default function (
  server: Hapi.Server,
  configs: ServerConfigurations,
  database: Database
) {
  const todoController = new TodoController(configs, database);
  server.bind(todoController);

  server.route({
    method: 'POST',
    path: '/todos',
    options: {
      handler: todoController.createTodo,
      auth: 'jwt',
      tags: ['api', 'todo'],
      description: 'Create a todo.',
      validate: {
        options: {
          abortEarly: false,
        },
        payload: TodoValidator.createTodoModel,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });
}
