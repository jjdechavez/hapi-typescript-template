import Joi from 'joi';

export const createUserModel = Joi.object().keys({
  username: Joi.string().trim().required(),
  name: Joi.string().min(3).required(),
  password: Joi.string().min(6).trim().required(),
});

export const updateUserModel = Joi.object().keys({
  username: Joi.string().email().trim(),
  name: Joi.string().min(3),
  password: Joi.string().min(6).trim(),
});

export const loginUserModel = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().trim().required(),
});

export const jwtValidator = Joi.object({
  authorization: Joi.string().required(),
}).unknown();
