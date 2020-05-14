const { Users, Auth } = require('../db/models');
const logger = require('../config/logger');

const createUserRepository = async (params) => {
  try {
    const user = await Users.create(
      params,
      {
        include: [{ model: Auth, as: 'auth_provider' }]
      });
    logger.systemLogLevel({ meta: { body: user.dataValues }, function: 'createUser' });
    return user;
  } catch (error) {
    logger.systemLogLevel({ error, level: 'error', function: 'createUser' });
    throw error;
  }
};

module.exports = {
  createUserRepository,
};
