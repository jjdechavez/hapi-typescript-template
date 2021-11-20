import Hapi from '@hapi/hapi';
import Joi from 'joi';
import BlogController from './blog-controller';
import * as BlogValidator from './blog-validator';
import {ServerConfigurations} from '@/configurations';
import {Database} from '@/database';
import {jwtValidator} from '../users/user-validator';

export default function (
  server: Hapi.Server,
  configs: ServerConfigurations,
  database: Database
) {
  const blogController = new BlogController(configs, database);
  server.bind(blogController);

  server.route({
    method: 'GET',
    path: '/blogs/{id}',
    options: {
      handler: blogController.getBlogById,
      auth: false,
      tags: ['api', 'blog'],
      description: 'Get blog by id.',
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
    path: '/blogs',
    options: {
      handler: blogController.getBlogs,
      auth: false,
      tags: ['api', 'blog'],
      description: 'Get blogs.',
      validate: {
        options: {
          abortEarly: false,
        },
        query: Joi.object({
          limit: Joi.number().default(10),
          before: Joi.string(),
          after: Joi.string(),
        }),
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/blogs',
    options: {
      handler: blogController.createBlog,
      auth: 'jwt',
      tags: ['api', 'blog'],
      description: 'Create a blog.',
      validate: {
        options: {
          abortEarly: false,
        },
        payload: BlogValidator.createBlogModel,
        headers: jwtValidator,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });

  server.route({
    method: 'PATCH',
    path: '/blogs/{id}',
    options: {
      handler: blogController.updateBlog,
      auth: 'jwt',
      tags: ['api', 'blogs'],
      description: 'Update blog by id.',
      validate: {
        options: {
          abortEarly: false,
        },
        params: Joi.object({
          id: Joi.string().required(),
        }),
        payload: BlogValidator.updateBlogModel,
        headers: jwtValidator,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });

  server.route({
    method: 'DELETE',
    path: '/blogs/{id}',
    options: {
      handler: blogController.deleteBlog,
      auth: 'jwt',
      tags: ['api', 'blog'],
      description: 'Delete blog by id.',
      validate: {
        options: {
          abortEarly: false,
        },
        params: Joi.object({
          id: Joi.string().required(),
        }),
        headers: jwtValidator,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/blogs/user',
    options: {
      handler: blogController.getUserBlogs,
      auth: 'jwt',
      tags: ['api', 'blog'],
      description: 'Get user blogs.',
      validate: {
        options: {
          abortEarly: false,
        },
        query: Joi.object({
          limit: Joi.number().default(10),
        }),
        headers: jwtValidator,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  });
}
