import Hapi from '@hapi/hapi';
import UserController from './user-controller';
import * as UserValidator from './user-validator';
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
    path: '/users',
    options: {
      handler: userController.createUser,
      auth: false,
      tags: ['api', 'users'],
      description: 'Create a user.',
      validate: {
        options: {
          abortEarly: false,
        },
        payload: UserValidator.createUserModel,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/users/login',
    options: {
      handler: userController.loginUser,
      auth: false,
      tags: ['api', 'users'],
      description: 'Login a user.',
      validate: {
        options: {
          abortEarly: false,
        },
        payload: UserValidator.loginUserModel,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/users/info',
    options: {
      handler: userController.infoUser,
      auth: 'jwt',
      tags: ['api', 'users'],
      description: 'Get user info.',
      validate: {
        options: {
          abortEarly: false,
        },
        headers: UserValidator.jwtValidator,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });
}
