import Joi from 'joi';

export const createTodoModel = Joi.object().keys({
  name: Joi.string().min(1).max(30).required(),
  description: Joi.string().max(255),
});
