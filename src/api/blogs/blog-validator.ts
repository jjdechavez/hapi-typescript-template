import Joi from 'joi';

export const createBlogModel = Joi.object().keys({
  name: Joi.string().min(1).max(30).required(),
  description: Joi.string().max(255),
});

export const updateBlogModel = Joi.object().keys({
  name: Joi.string().min(1).max(30),
  description: Joi.string().max(255),
});
