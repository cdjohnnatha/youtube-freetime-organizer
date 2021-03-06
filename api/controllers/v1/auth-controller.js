const { houstonClientErrors } = require('houston-errors');
const i18n = require('i18n');
const { signupSchema, authEmailSchema } = require('./schemas/auth-schemas');
const { createUserRepository } = require('../../repositories/users-respository');
const logger = require('../../config/logger');
const { generateJWT } = require('../../helpers/token-helpers');
const { Auth, Users } = require('../../db/models');
const { formatErrorMessage } = require('../../helpers/formatter-helpers')
const { BAD_REQUEST } = houstonClientErrors;

const signUpController = async ({ body }, response) => {
  try {
      await signupSchema.validate(body);
      const user = await createUserRepository(body);
      logger.systemLogLevel({ body: user.dataValues, functionName: 'signUpController' });
      response.status(201).send({ user: user.dataValues });
  } catch (error) {
    logger.systemLogLevel({ error, level: 'error' });
    response.status(BAD_REQUEST.code).send(error);
  }
};

const authEmailProviderController = async ({ body, ...props }, response) => {
  try {
    const isParamsValid = await authEmailSchema.validate(body);
    if (isParamsValid) {
      const isPasswordValid = await Auth.isPasswordValid(body);
      if (isPasswordValid) {
        const auth = await Auth.findOne({
          where: { email: body.email },
          attributes: ['id'],
          include: [
            {
              model: Users,
              as: 'users',
              attributes: ['id', 'first_name', 'last_name'],
            },
          ]
        });
        logger.systemLogLevel({ meta: { auth }, functionName: 'authEmailProvider' });
        const jwt = await generateJWT({ user_id: auth.dataValues.users.id });
        response.status(200).send({ ...jwt, user: auth.dataValues.users });
      } else {
        response.status(BAD_REQUEST.code).send(i18n.__('error.invalid_sign_in'));
      }
    }
  } catch (error) {
    logger.systemLogLevel({ error, level: 'error' });
    response.status(BAD_REQUEST.code).send(formatErrorMessage(error));
  }
};

module.exports = {
  signUpController,
  authEmailProviderController,
};
