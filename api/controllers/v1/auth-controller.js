const { houstonClientErrors } = require('houston-errors');
const { signupSchema } = require('./schemas/auth-schemas');
const { createUserRepository } = require('../../repositories/users-respository');
const logger = require('../../config/logger');

const { BAD_REQUEST } = houstonClientErrors;

const signUpController = async ({ body }, response) => {
  try {
    console.log('body', body);
    const isParamsValid = await signupSchema.validate(body);
    if (isParamsValid) {
      const user = await createUserRepository(body);
      logger.systemLogLevel({ body: user.dataValues, function: 'signUpController' });
      response.status(201).send(user);
    }
  } catch (error) {
    logger.systemLogLevel({ error, level: 'error' });
    response.status(BAD_REQUEST.code).send(error);
  }
};

module.exports = {
  signUpController,
};
