import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().min(8).required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
  DEFAULT_TAX_RATE: Joi.number().min(0).default(0.18),
  ALLOW_DELIVERY_WITH_PENDING_BALANCE: Joi.boolean().default(false),
});
