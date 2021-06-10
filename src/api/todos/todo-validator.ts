import Joi from 'joi';

export const createTodoModel = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string(),
});
