const { Users } = require('../db/models');
const logger = require('../config/logger');

const createUserRepository = async (params) => {
  try {
    const user = await Users.create(params);
    logger.systemLogLevel({ body: user.dataValues, function: 'createUser' });
    return user;
  } catch (error) {
    logger.systemLogLevel({ error, level: 'error', meta: { function: 'createUser' } });
    throw error;
  }
};

module.exports = {
  createUserRepository,
};