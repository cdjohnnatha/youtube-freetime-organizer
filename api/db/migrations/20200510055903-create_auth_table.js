const AuthDataTypes = require('../models/data-types/auth-data-types');

module.exports = {
  up: (queryInterface) => queryInterface.createTable('auth', AuthDataTypes),

  down: (queryInterface) => queryInterface.dropTable('auth'),
};
