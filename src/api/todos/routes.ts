import Hapi from '@hapi/hapi';
import Joi from 'joi';
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
    method: 'GET',
    path: '/todos/{id}',
    options: {
      handler: todoController.getTodoById,
      auth: false,
      tags: ['api', 'todo'],
      description: 'Get todo by id.',
      validate: {
        options: {
          abortEarly: false,
        },
        params: Joi.object({
          id: Joi.string().required(),
        }),
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/todos',
    options: {
      handler: todoController.getTodos,
      auth: false,
      tags: ['api', 'todo'],
      description: 'Get todos.',
      validate: {
        options: {
          abortEarly: false,
        },
        query: Joi.object({
          limit: Joi.number().default(10),
          skip: Joi.number().default(0),
        }),
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });

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
