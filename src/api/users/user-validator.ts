import Joi from 'joi';

export const createUserModel = Joi.object().keys({
  username: Joi.string().trim().required(),
  name: Joi.string().required(),
  password: Joi.string().trim().required(),
});

export const updateUserModel = Joi.object().keys({
  username: Joi.string().email().trim(),
  name: Joi.string(),
  password: Joi.string().trim(),
});

export const loginUserModel = Joi.object().keys({
  username: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});

export const jwtValidator = Joi.object({
  authorization: Joi.string().required(),
}).unknown();
