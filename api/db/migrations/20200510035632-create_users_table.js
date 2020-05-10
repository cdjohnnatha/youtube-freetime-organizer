const UsersDataTypes = require('../models/data-types/users-data-types');

module.exports = {
  up: (queryInterface) => queryInterface.createTable('users', UsersDataTypes),

  down: (queryInterface) => queryInterface.dropTable('users'),
};
